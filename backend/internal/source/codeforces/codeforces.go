package codeforces

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// Source loads Codeforces contests from the public contest list API.
type Source struct {
	url    string
	client *http.Client
	now    func() time.Time
}

// New returns a Codeforces contest source.
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
	return domain.PlatformCodeforces
}

type apiResponse struct {
	Status  string        `json:"status"`
	Comment string        `json:"comment"`
	Result  []contestItem `json:"result"`
}

type contestItem struct {
	ID               int    `json:"id"`
	Name             string `json:"name"`
	Phase            string `json:"phase"`
	StartTimeSeconds *int64 `json:"startTimeSeconds"`
	DurationSeconds  int64  `json:"durationSeconds"`
}

// Fetch returns upcoming, ongoing, and recently finished Codeforces contests.
func (s *Source) Fetch(ctx context.Context) ([]domain.Contest, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.url, nil)
	if err != nil {
		return nil, fmt.Errorf("build codeforces request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "Codexia/0.1")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call codeforces: %w", err)
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(io.LimitReader(resp.Body, 16<<20))
	if err != nil {
		return nil, fmt.Errorf("read codeforces response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("codeforces status %d", resp.StatusCode)
	}

	var decoded apiResponse
	if err := json.Unmarshal(payload, &decoded); err != nil {
		return nil, fmt.Errorf("decode codeforces response: %w", err)
	}
	if decoded.Status != "OK" {
		comment := decoded.Comment
		if comment == "" {
			comment = decoded.Status
		}
		return nil, fmt.Errorf("codeforces api: %s", comment)
	}

	now := s.now()
	contests := make([]domain.Contest, 0)
	for _, item := range decoded.Result {
		contest, ok := item.toContest(now)
		if ok {
			contests = append(contests, contest)
		}
	}
	return contests, nil
}

func (c contestItem) toContest(now time.Time) (domain.Contest, bool) {
	if c.ID == 0 || c.Name == "" || c.StartTimeSeconds == nil || c.DurationSeconds <= 0 {
		return domain.Contest{}, false
	}

	start := time.Unix(*c.StartTimeSeconds, 0).UTC()
	duration := time.Duration(c.DurationSeconds) * time.Second
	end := start.Add(duration)
	if !domain.Kept(end, now, domain.RecentContestWindow) {
		return domain.Contest{}, false
	}

	id := strconv.Itoa(c.ID)
	return domain.Contest{
		Platform:   domain.PlatformCodeforces,
		PlatformID: id,
		Title:      c.Name,
		URL:        "https://codeforces.com/contest/" + id,
		StartTime:  start,
		EndTime:    end,
		Duration:   duration,
	}, true
}
