package codechef

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// ContestSource loads CodeChef contests from the public contest list API.
type ContestSource struct {
	url    string
	client *http.Client
	now    func() time.Time
}

// NewContests returns a CodeChef contest source.
func NewContests(url string) *ContestSource {
	return &ContestSource{
		url:    url,
		client: &http.Client{Timeout: 20 * time.Second},
		now:    time.Now,
	}
}

// Name identifies the platform in logs.
func (s *ContestSource) Name() string {
	return domain.PlatformCodeChef
}

type contestList struct {
	Status          string    `json:"status"`
	PresentContests []contest `json:"present_contests"`
	FutureContests  []contest `json:"future_contests"`
	PastContests    []contest `json:"past_contests"`
}

type contest struct {
	Code  string `json:"contest_code"`
	Name  string `json:"contest_name"`
	Start string `json:"contest_start_date_iso"`
	End   string `json:"contest_end_date_iso"`
}

// Fetch returns upcoming, ongoing, and recently finished CodeChef contests.
func (s *ContestSource) Fetch(ctx context.Context) ([]domain.Contest, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.url, nil)
	if err != nil {
		return nil, fmt.Errorf("build codechef request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", browserUA)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call codechef: %w", err)
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(io.LimitReader(resp.Body, 8<<20))
	if err != nil {
		return nil, fmt.Errorf("read codechef response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("codechef status %d", resp.StatusCode)
	}

	var decoded contestList
	if err := json.Unmarshal(payload, &decoded); err != nil {
		return nil, fmt.Errorf("decode codechef response: %w", err)
	}
	if decoded.Status != "" && decoded.Status != "success" {
		return nil, fmt.Errorf("codechef api: %s", decoded.Status)
	}

	now := s.now()
	groups := [][]contest{decoded.PresentContests, decoded.FutureContests, decoded.PastContests}
	contests := make([]domain.Contest, 0)
	for _, group := range groups {
		for _, item := range group {
			contest, ok := item.toContest(now)
			if ok {
				contests = append(contests, contest)
			}
		}
	}
	return contests, nil
}

func (c contest) toContest(now time.Time) (domain.Contest, bool) {
	if c.Code == "" || c.Name == "" {
		return domain.Contest{}, false
	}
	start, err := time.Parse(time.RFC3339, c.Start)
	if err != nil {
		return domain.Contest{}, false
	}
	end, err := time.Parse(time.RFC3339, c.End)
	if err != nil || !end.After(start) {
		return domain.Contest{}, false
	}
	if !domain.Kept(end, now, domain.RecentContestWindow) {
		return domain.Contest{}, false
	}
	return domain.Contest{
		Platform:   domain.PlatformCodeChef,
		PlatformID: c.Code,
		Title:      c.Name,
		URL:        "https://www.codechef.com/" + c.Code,
		StartTime:  start.UTC(),
		EndTime:    end.UTC(),
		Duration:   end.Sub(start),
	}, true
}
