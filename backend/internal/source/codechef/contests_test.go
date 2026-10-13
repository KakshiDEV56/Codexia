package codechef

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestFetchFiltersInvalidAndExpiredContests(t *testing.T) {
	now := time.Date(2026, 10, 1, 12, 0, 0, 0, time.UTC)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("{\"status\":\"success\",\"present_contests\":[\" +
			"{\"contest_code\":\"LIVE\",\"contest_name\":\"Live contest\",\"contest_start_date_iso\":\"2026-10-01T11:00:00Z\",\"contest_end_date_iso\":\"2026-10-01T13:00:00Z\"}," +
			"{\"contest_code\":\"BAD\",\"contest_name\":\"Invalid times\",\"contest_start_date_iso\":\"not-a-time\",\"contest_end_date_iso\":\"2026-10-01T13:00:00Z\"}," +
			"{\"contest_code\":\"REVERSED\",\"contest_name\":\"Reversed\",\"contest_start_date_iso\":\"2026-10-01T13:00:00Z\",\"contest_end_date_iso\":\"2026-10-01T12:00:00Z\"}]," +
			"\"future_contests\":[{\"contest_code\":\"NEXT\",\"contest_name\":\"Next\",\"contest_start_date_iso\":\"2026-10-02T10:00:00Z\",\"contest_end_date_iso\":\"2026-10-02T12:00:00Z\"}]," +
			"\"past_contests\":[{\"contest_code\":\"OLD\",\"contest_name\":\"Old\",\"contest_start_date_iso\":\"2026-08-01T10:00:00Z\",\"contest_end_date_iso\":\"2026-08-01T12:00:00Z\"}]}"))
	}))
	defer server.Close()

	src := NewContests(server.URL)
	src.now = func() time.Time { return now }
	got, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 {
		t.Fatalf("got %d contests: %+v", len(got), got)
	}
	if got[0].PlatformID != "LIVE" || got[1].PlatformID != "NEXT" {
		t.Fatalf("unexpected order or filtering: %+v", got)
	}
	if got[0].URL != "https://www.codechef.com/LIVE" {
		t.Fatalf("unexpected URL: %s", got[0].URL)
	}
}

func TestFetchReturnsHTTPAndDecodeErrors(t *testing.T) {
	for _, tt := range []struct {
		name   string
		status int
		body   string
		want   string
	}{
		{"http error", http.StatusBadGateway, "bad gateway", "status 502"},
		{"invalid json", http.StatusOK, "{", "decode codechef response"},
		{"api error", http.StatusOK, "{\"status\":\"error\"}", "codechef api"},
	} {
		t.Run(tt.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(tt.status)
				_, _ = w.Write([]byte(tt.body))
			}))
			defer server.Close()

			_, err := NewContests(server.URL).Fetch(context.Background())
			if err == nil || !strings.Contains(err.Error(), tt.want) {
				t.Fatalf("error = %v, want %q", err, tt.want)
			}
		})
	}
}
