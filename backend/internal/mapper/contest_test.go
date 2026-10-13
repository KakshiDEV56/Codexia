package mapper

import (
	"testing"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

func TestToContestResponse(t *testing.T) {
	loc := time.FixedZone("UTC+5:30", 5*60*60+30*60)
	start := time.Date(2026, 10, 2, 9, 0, 0, 0, loc)
	end := start.Add(90 * time.Minute)
	now := start.Add(-time.Second)
	got := ToContestResponse(domain.Contest{
		Platform:   domain.PlatformCodeChef,
		PlatformID: "START42",
		Title:      "  Long Challenge  ",
		URL:       "https://example.test/contest",
		StartTime: start,
		EndTime:   end,
		Duration:  90 * time.Minute,
	}, now)

	if got.ID != "codechef-START42" || got.Platform != domain.PlatformCodeChef {
		t.Fatalf("identity fields = %+v", got)
	}
	if got.Title != "  Long Challenge  " || got.URL != "https://example.test/contest" {
		t.Fatalf("mapper unexpectedly changed input fields: %+v", got)
	}
	if got.StartTime != "2026-10-02T03:30:00Z" || got.EndTime != "2026-10-02T05:00:00Z" {
		t.Fatalf("UTC timestamps = %q .. %q", got.StartTime, got.EndTime)
	}
	if got.Duration != 1.5 || got.Status != domain.StatusUpcoming {
		t.Fatalf("duration/status = %v/%q", got.Duration, got.Status)
	}
}

func TestToContestResponseRoundsDuration(t *testing.T) {
	now := time.Now()
	got := ToContestResponse(domain.Contest{
		Duration: time.Hour + 14*time.Minute + 24*time.Second,
	}, now)
	if got.Duration != 1.24 {
		t.Fatalf("duration = %v, want 1.24", got.Duration)
	}
}
