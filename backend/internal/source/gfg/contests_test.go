package gfg

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestFetchKeepsUpcomingContest(t *testing.T) {
	now := time.Date(2026, 9, 27, 12, 0, 0, 0, time.UTC)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("type") != "contest" {
			t.Fatalf("query %s", r.URL.RawQuery)
		}
		_, _ = w.Write([]byte(`{
			"past_next": false,
			"results": {
				"upcoming": [{"slug":"weekly-182","name":"GFG Weekly 182","start_time":"2026-10-04T19:00:00","end_time":"2026-10-04T21:00:00"}],
				"past": [{"slug":"old","name":"Old","start_time":"2026-05-17T19:00:00","end_time":"2026-05-17T21:00:00"}]
			}
		}`))
	}))
	defer server.Close()

	src := New(server.URL)
	src.now = func() time.Time { return now }
	contests, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(contests) != 1 || contests[0].PlatformID != "weekly-182" || contests[0].Duration != 2*time.Hour {
		t.Fatalf("%+v", contests)
	}
	if contests[0].StartTime.UTC().Hour() != 13 {
		t.Fatalf("expected 19:00 IST as 13:30 UTC, got %s", contests[0].StartTime)
	}
}
