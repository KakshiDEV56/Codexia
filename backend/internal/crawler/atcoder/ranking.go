package atcoder

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/html"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

const rankingLimit = 25

// RankingSource crawls the public AtCoder algorithm ranking page.
type RankingSource struct {
	url    string
	client *http.Client
}

// NewRanking returns an AtCoder leaderboard crawler.
func NewRanking(url string) *RankingSource {
	return &RankingSource{
		url:    url,
		client: &http.Client{Timeout: 20 * time.Second},
	}
}

// Name identifies the platform in logs.
func (s *RankingSource) Name() string {
	return domain.PlatformAtCoder
}

// Fetch reads the top rows of the AtCoder ranking table.
func (s *RankingSource) Fetch(ctx context.Context) ([]domain.Standing, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.url, nil)
	if err != nil {
		return nil, fmt.Errorf("build atcoder ranking request: %w", err)
	}
	req.Header.Set("Accept", "text/html")
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Codexia/0.1)")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call atcoder ranking: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("atcoder ranking status %d", resp.StatusCode)
	}

	standings, err := parseRanking(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return nil, fmt.Errorf("parse atcoder ranking: %w", err)
	}
	s.attachAvatars(ctx, standings)
	return standings, nil
}

func (s *RankingSource) attachAvatars(ctx context.Context, standings []domain.Standing) {
	var wg sync.WaitGroup
	sem := make(chan struct{}, 5)
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
			photo, err := s.userAvatar(ctx, standings[i].Handle)
			if err == nil && photo != "" {
				standings[i].Avatar = photo
			}
		}(i)
	}
	wg.Wait()
}

func (s *RankingSource) userAvatar(ctx context.Context, handle string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://atcoder.jp/users/"+handle, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Accept", "text/html")
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Codexia/0.1)")
	resp, err := s.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("status %d", resp.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, 2<<20))
	if err != nil {
		return "", err
	}
	return avatarFromProfile(string(body)), nil
}

func avatarFromProfile(page string) string {
	doc, err := html.Parse(strings.NewReader(page))
	if err != nil {
		return ""
	}
	var src string
	var walk func(*html.Node)
	walk = func(n *html.Node) {
		if src != "" {
			return
		}
		if n.Type == html.ElementNode && n.Data == "img" && attr(n, "class") == "avatar" {
			src = attr(n, "src")
			return
		}
		for child := n.FirstChild; child != nil; child = child.NextSibling {
			walk(child)
		}
	}
	walk(doc)
	if strings.HasPrefix(src, "//") {
		return "https:" + src
	}
	return src
}

func parseRanking(r io.Reader) ([]domain.Standing, error) {
	doc, err := html.Parse(r)
	if err != nil {
		return nil, err
	}

	standings := make([]domain.Standing, 0, rankingLimit)
	var walk func(*html.Node)
	walk = func(n *html.Node) {
		if len(standings) >= rankingLimit {
			return
		}
		if n.Type == html.ElementNode && n.Data == "tr" {
			if standing, ok := standingFromRow(n); ok {
				standings = append(standings, standing)
			}
		}
		for child := n.FirstChild; child != nil && len(standings) < rankingLimit; child = child.NextSibling {
			walk(child)
		}
	}
	walk(doc)
	return standings, nil
}

func standingFromRow(row *html.Node) (domain.Standing, bool) {
	var rankText, handle string
	var bold []int
	firstCell := true
	var visit func(*html.Node)
	visit = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "td" && firstCell {
			rankText = strings.TrimSpace(text(n))
			firstCell = false
		}
		if n.Type == html.ElementNode && n.Data == "a" && handle == "" && attr(n, "class") == "username" {
			handle = strings.TrimSpace(text(n))
		}
		if n.Type == html.ElementNode && n.Data == "b" {
			if value, err := strconv.Atoi(strings.TrimSpace(text(n))); err == nil {
				bold = append(bold, value)
			}
		}
		for child := n.FirstChild; child != nil; child = child.NextSibling {
			visit(child)
		}
	}
	visit(row)

	rank, err := strconv.Atoi(rankText)
	if err != nil || handle == "" || len(bold) == 0 || rank <= 0 {
		return domain.Standing{}, false
	}
	return domain.Standing{
		Platform:   domain.PlatformAtCoder,
		Handle:     handle,
		Rank:       rank,
		Rating:     bold[0],
		ProfileURL: "https://atcoder.jp/users/" + handle,
	}, true
}
