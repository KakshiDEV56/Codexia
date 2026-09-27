package gfg

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

// Event times on the GeeksforGeeks events API are India Standard Time without a zone.
var ist = time.FixedZone("IST", 5*3600+30*60)

// Source loads GeeksforGeeks contests from the events JSON used by geeksforgeeks.org/events.
type Source struct {
	url    string
	client *http.Client
	now    func() time.Time
}

// New returns a GeeksforGeeks contest source.
func New(url string) *Source {
	return &Source{
		url:    url,
		client: &http.Client{Timeout: 20 * time.Second},
		now:    time.Now,
	}
}

// Name identifies the platform in logs.
func (s *Source) Name() string {
	return domain.PlatformGFG
}

type eventsResponse struct {
	PastNext bool `json:"past_next"`
	Results  struct {
		Upcoming []event `json:"upcoming"`
		Past     []event `json:"past"`
	} `json:"results"`
}

type event struct {
	Slug      string `json:"slug"`
	Name      string `json:"name"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

// Fetch returns upcoming, ongoing, and recently finished GeeksforGeeks contests.
func (s *Source) Fetch(ctx context.Context) ([]domain.Contest, error) {
	now := s.now()
	contests := make([]domain.Contest, 0)
	seen := map[string]struct{}{}

	for page := 1; page <= 4; page++ {
		decoded, err := s.fetchPage(ctx, page)
		if err != nil {
			return nil, err
		}
		for _, item := range decoded.Results.Upcoming {
			addContest(item, now, seen, &contests)
		}
		reachedOlder := false
		for _, item := range decoded.Results.Past {
			if contest, ok := item.toContest(now); ok {
				if _, exists := seen[contest.PlatformID]; !exists {
					seen[contest.PlatformID] = struct{}{}
					contests = append(contests, contest)
				}
				continue
			}
			if item.StartTime != "" {
				reachedOlder = true
				break
			}
		}
		if reachedOlder || !decoded.PastNext {
			break
		}
	}
	return contests, nil
}

func addContest(item event, now time.Time, seen map[string]struct{}, contests *[]domain.Contest) {
	contest, ok := item.toContest(now)
	if !ok {
		return
	}
	if _, exists := seen[contest.PlatformID]; exists {
		return
	}
	seen[contest.PlatformID] = struct{}{}
	*contests = append(*contests, contest)
}

func (s *Source) fetchPage(ctx context.Context, page int) (eventsResponse, error) {
	pageURL := s.url + "?page_number=" + strconv.Itoa(page) + "&sub_type=all&type=contest"
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, pageURL, nil)
	if err != nil {
		return eventsResponse{}, fmt.Errorf("build gfg request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Referer", "https://www.geeksforgeeks.org/events")
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Codexia/0.1)")

	resp, err := s.client.Do(req)
	if err != nil {
		return eventsResponse{}, fmt.Errorf("call gfg: %w", err)
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return eventsResponse{}, fmt.Errorf("read gfg response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return eventsResponse{}, fmt.Errorf("gfg status %d", resp.StatusCode)
	}

	var decoded eventsResponse
	if err := json.Unmarshal(payload, &decoded); err != nil {
		return eventsResponse{}, fmt.Errorf("decode gfg response: %w", err)
	}
	return decoded, nil
}

func (e event) toContest(now time.Time) (domain.Contest, bool) {
	if e.Slug == "" || e.Name == "" {
		return domain.Contest{}, false
	}
	start, err := time.ParseInLocation("2006-01-02T15:04:05", e.StartTime, ist)
	if err != nil {
		return domain.Contest{}, false
	}
	end, err := time.ParseInLocation("2006-01-02T15:04:05", e.EndTime, ist)
	if err != nil || !end.After(start) {
		return domain.Contest{}, false
	}
	if !domain.Kept(end, now, domain.RecentContestWindow) {
		return domain.Contest{}, false
	}
	return domain.Contest{
		Platform:   domain.PlatformGFG,
		PlatformID: e.Slug,
		Title:      e.Name,
		URL:        "https://practice.geeksforgeeks.org/contest/" + e.Slug,
		StartTime:  start.UTC(),
		EndTime:    end.UTC(),
		Duration:   end.Sub(start),
	}, true
}
