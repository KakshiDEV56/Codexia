package codechef

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

const (
	browserUA      = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
	ratingPageSize = 25
	ratingsPageURL = "https://www.codechef.com/ratings/all"
)

var (
	csrfTokenPattern    = regexp.MustCompile(`csrfToken = "([0-9a-fA-F]+)"`)
	profileImagePattern = regexp.MustCompile(`<img class=['"]profileImage['"][^>]*src=['"]([^'"]+)['"]`)
)

// RatingSource loads the CodeChef global rating list.
// The ratings API rejects calls that do not carry the session cookie and CSRF token from the ratings page.
type RatingSource struct {
	url         string
	pageURL     string
	profileBase string
	client      *http.Client
}

// NewRatings returns a CodeChef leaderboard source.
func NewRatings(rawURL string) *RatingSource {
	jar, _ := cookiejar.New(nil)
	transport := http.DefaultTransport.(*http.Transport).Clone()
	transport.ForceAttemptHTTP2 = false
	transport.TLSClientConfig = &tls.Config{NextProtos: []string{"http/1.1"}}
	return &RatingSource{
		url:         rawURL,
		pageURL:     ratingsPageURL,
		profileBase: "https://www.codechef.com/users",
		client: &http.Client{
			Timeout:   30 * time.Second,
			Jar:       jar,
			Transport: transport,
		},
	}
}

// Name identifies the platform in logs.
func (s *RatingSource) Name() string {
	return domain.PlatformCodeChef
}

type ratingResponse struct {
	List []struct {
		Username   string `json:"username"`
		GlobalRank int    `json:"global_rank"`
		Rating     int    `json:"rating"`
	} `json:"list"`
}

// Fetch returns the top of the CodeChef global ranking.
func (s *RatingSource) Fetch(ctx context.Context) ([]domain.Standing, error) {
	token, err := s.csrfToken(ctx)
	if err != nil {
		return nil, err
	}

	endpoint, err := url.Parse(s.url)
	if err != nil {
		return nil, fmt.Errorf("parse codechef ratings url: %w", err)
	}
	query := endpoint.Query()
	query.Set("itemsPerPage", fmt.Sprintf("%d", ratingPageSize))
	query.Set("sortBy", "global_rank")
	query.Set("order", "asc")
	query.Set("page", "1")
	endpoint.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("build codechef ratings request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Referer", ratingsPageURL)
	req.Header.Set("User-Agent", browserUA)
	if token != "" {
		req.Header.Set("x-csrf-token", token)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call codechef ratings: %w", err)
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return nil, fmt.Errorf("read codechef ratings: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("codechef ratings status %d", resp.StatusCode)
	}

	var decoded ratingResponse
	if err := json.Unmarshal(payload, &decoded); err != nil {
		return nil, fmt.Errorf("decode codechef ratings: %w", err)
	}

	standings := make([]domain.Standing, 0, len(decoded.List))
	for _, item := range decoded.List {
		if item.Username == "" || item.GlobalRank <= 0 {
			continue
		}
		standings = append(standings, domain.Standing{
			Platform:   domain.PlatformCodeChef,
			Handle:     item.Username,
			Rank:       item.GlobalRank,
			Rating:     item.Rating,
			ProfileURL: "https://www.codechef.com/users/" + item.Username,
		})
		if len(standings) == ratingPageSize {
			break
		}
	}
	s.attachPhotos(ctx, standings)
	return standings, nil
}

func (s *RatingSource) attachPhotos(ctx context.Context, standings []domain.Standing) {
	if s.profileBase == "" {
		return
	}
	var wg sync.WaitGroup
	sem := make(chan struct{}, 4)
	for i := range standings {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			select {
			case sem <- struct{}{}:
			case <-ctx.Done():
				return
			}
			defer func() { <-sem }()
			photo, err := s.profilePhoto(ctx, standings[i].Handle)
			if err == nil && photo != "" {
				standings[i].Avatar = photo
			}
		}(i)
	}
	wg.Wait()
}

func (s *RatingSource) profilePhoto(ctx context.Context, handle string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.profileBase+"/"+url.PathEscape(handle), nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Accept", "text/html")
	req.Header.Set("User-Agent", browserUA)
	resp, err := s.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, 2<<20))
	if err != nil {
		return "", err
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("status %d", resp.StatusCode)
	}
	return profileImage(string(body)), nil
}

func profileImage(page string) string {
	match := profileImagePattern.FindStringSubmatch(page)
	if match == nil {
		return ""
	}
	src := match[1]
	if strings.HasPrefix(src, "//") {
		return "https:" + src
	}
	return src
}

func (s *RatingSource) csrfToken(ctx context.Context) (string, error) {
	if s.pageURL == "" {
		return "", nil
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.pageURL, nil)
	if err != nil {
		return "", fmt.Errorf("build codechef ratings page request: %w", err)
	}
	req.Header.Set("Accept", "text/html")
	req.Header.Set("User-Agent", browserUA)

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("call codechef ratings page: %w", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return "", fmt.Errorf("read codechef ratings page: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("codechef ratings page status %d", resp.StatusCode)
	}
	match := csrfTokenPattern.FindSubmatch(body)
	if match == nil {
		return "", fmt.Errorf("codechef ratings page did not include a csrf token")
	}
	return string(match[1]), nil
}
