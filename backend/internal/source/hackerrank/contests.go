package hackerrank

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

const upcomingHorizon = 90 * 24 * time.Hour

// Source loads HackerRank contests from the public contests REST API.
type Source struct {
	upcomingURL string
	archivedURL string
	client      *http.Client
	now         func() time.Time
}

// New returns a HackerRank contest source.
func New(upcomingURL, archivedURL string) *Source {
	return &Source{
		upcomingURL: upcomingURL,
		archivedURL: archivedURL,
		client:      &http.Client{Timeout: 25 * time.Second},
		now:         time.Now,
	}
}

// Name identifies the platform in logs.
func (s *Source) Name() string {
	return domain.PlatformHackerRank
}

type listResponse struct {
	Models []contestItem `json:"models"`
	Total  int           `json:"total"`
}

type contestItem struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	StartISO  string `json:"get_starttimeiso"`
	EndISO    string `json:"get_endtimeiso"`
	StartUnix int64  `json:"epoch_starttime"`
	EndUnix   int64  `json:"epoch_endtime"`
}

// Fetch returns upcoming HackerRank contests in the next 90 days and recent finished ones.
func (s *Source) Fetch(ctx context.Context) ([]domain.Contest, error) {
	upcoming, err := s.fetchPages(ctx, s.upcomingURL, 3)
	if err != nil {
		return nil, err
	}
	archived, err := s.fetchPages(ctx, s.archivedURL, 1)
	if err != nil {
		return nil, err
	}

	now := s.now()
	contests := make([]domain.Contest, 0)
	seen := map[string]struct{}{}
	for _, item := range append(upcoming, archived...) {
		contest, ok := item.toContest(now)
		if !ok {
			continue
		}
		if _, exists := seen[contest.PlatformID]; exists {
			continue
		}
		seen[contest.PlatformID] = struct{}{}
		contests = append(contests, contest)
	}
	return contests, nil
}

func (s *Source) fetchPages(ctx context.Context, rawURL string, pages int) ([]contestItem, error) {
	collected := make([]contestItem, 0)
	for page := 0; page < pages; page++ {
		pageURL := rawURL + "?offset=" + strconv.Itoa(page*100) + "&limit=100"
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, pageURL, nil)
		if err != nil {
			return nil, fmt.Errorf("build hackerrank request: %w", err)
		}
		req.Header.Set("Accept", "application/json")
		req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Codexia/0.1)")

		resp, err := s.client.Do(req)
		if err != nil {
			return nil, fmt.Errorf("call hackerrank: %w", err)
		}
		payload, readErr := io.ReadAll(io.LimitReader(resp.Body, 16<<20))
		resp.Body.Close()
		if readErr != nil {
			return nil, fmt.Errorf("read hackerrank response: %w", readErr)
		}
		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("hackerrank status %d", resp.StatusCode)
		}

		var decoded listResponse
		if err := json.Unmarshal(payload, &decoded); err != nil {
			return nil, fmt.Errorf("decode hackerrank response: %w", err)
		}
		collected = append(collected, decoded.Models...)
		if len(decoded.Models) < 100 || len(collected) >= decoded.Total {
			break
		}
	}
	return collected, nil
}

func (c contestItem) toContest(now time.Time) (domain.Contest, bool) {
	if c.ID == 0 || c.Slug == "" || c.Name == "" {
		return domain.Contest{}, false
	}
	start, end, ok := c.times()
	if !ok || !end.After(start) {
		return domain.Contest{}, false
	}
	if start.After(now.Add(upcomingHorizon)) {
		return domain.Contest{}, false
	}
	if !domain.Kept(end, now, domain.RecentContestWindow) {
		return domain.Contest{}, false
	}
	id := strconv.Itoa(c.ID)
	return domain.Contest{
		Platform:   domain.PlatformHackerRank,
		PlatformID: id,
		Title:      c.Name,
		URL:        "https://www.hackerrank.com/contests/" + c.Slug,
		StartTime:  start.UTC(),
		EndTime:    end.UTC(),
		Duration:   end.Sub(start),
	}, true
}

func (c contestItem) times() (time.Time, time.Time, bool) {
	if c.StartISO != "" && c.EndISO != "" {
		start, err1 := time.Parse(time.RFC3339, c.StartISO)
		end, err2 := time.Parse(time.RFC3339, c.EndISO)
		if err1 == nil && err2 == nil {
			return start, end, true
		}
	}
	if c.StartUnix <= 0 || c.EndUnix <= 0 {
		return time.Time{}, time.Time{}, false
	}
	return time.Unix(c.StartUnix, 0), time.Unix(c.EndUnix, 0), true
}
