package leetcode

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

const contestQuery = `query { allContests { title titleSlug startTime duration } }`

// Source loads LeetCode contests from the public GraphQL endpoint.
type Source struct {
	url    string
	client *http.Client
	now    func() time.Time
}

// New returns a LeetCode contest source.
func New(url string) *Source {
	return &Source{
		url: url,
		client: &http.Client{
			Timeout: 20 * time.Second,
		},
		now: time.Now,
	}
}

// Name identifies the platform in logs.
func (s *Source) Name() string {
	return domain.PlatformLeetCode
}

type graphQLRequest struct {
	Query string `json:"query"`
}

type graphQLResponse struct {
	Data struct {
		AllContests []contestPayload `json:"allContests"`
	} `json:"data"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

type contestPayload struct {
	Title     string `json:"title"`
	TitleSlug string `json:"titleSlug"`
	StartTime int64  `json:"startTime"`
	Duration  int64  `json:"duration"`
}

// Fetch returns upcoming, ongoing, and recently finished LeetCode contests.
func (s *Source) Fetch(ctx context.Context) ([]domain.Contest, error) {
	body, err := json.Marshal(graphQLRequest{Query: contestQuery})
	if err != nil {
		return nil, fmt.Errorf("encode leetcode query: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.url, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("build leetcode request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Referer", "https://leetcode.com/contest/")
	req.Header.Set("Origin", "https://leetcode.com")
	req.Header.Set("User-Agent", "Codexia/0.1")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call leetcode: %w", err)
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(io.LimitReader(resp.Body, 8<<20))
	if err != nil {
		return nil, fmt.Errorf("read leetcode response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("leetcode status %d", resp.StatusCode)
	}

	var decoded graphQLResponse
	if err := json.Unmarshal(payload, &decoded); err != nil {
		return nil, fmt.Errorf("decode leetcode response: %w", err)
	}
	if len(decoded.Errors) > 0 {
		return nil, fmt.Errorf("leetcode graphql: %s", decoded.Errors[0].Message)
	}

	now := s.now()
	contests := make([]domain.Contest, 0)
	for _, item := range decoded.Data.AllContests {
		contest, ok := item.toContest(now)
		if ok {
			contests = append(contests, contest)
		}
	}
	return contests, nil
}

func (p contestPayload) toContest(now time.Time) (domain.Contest, bool) {
	if p.TitleSlug == "" || p.StartTime <= 0 || p.Duration <= 0 {
		return domain.Contest{}, false
	}

	startUnix := p.StartTime
	if startUnix > 1_000_000_000_000 {
		startUnix /= 1000
	}

	start := time.Unix(startUnix, 0).UTC()
	duration := time.Duration(p.Duration) * time.Second
	end := start.Add(duration)
	if !domain.Kept(end, now, domain.RecentContestWindow) {
		return domain.Contest{}, false
	}

	return domain.Contest{
		Platform:   domain.PlatformLeetCode,
		PlatformID: p.TitleSlug,
		Title:      p.Title,
		URL:        "https://leetcode.com/contest/" + p.TitleSlug,
		StartTime:  start,
		EndTime:    end,
		Duration:   duration,
	}, true
}
