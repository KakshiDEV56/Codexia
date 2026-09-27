package hackerrank

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestFetchKeepsNearContests(t *testing.T) {
	now := time.Date(2026, 9, 27, 0, 0, 0, 0, time.UTC)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.URL.Path == "/upcoming":
			_, _ = w.Write([]byte(`{"total":1,"models":[{"id":9,"name":"HourRank","slug":"hourrank-50","get_starttimeiso":"2026-10-02T12:00:00Z","get_endtimeiso":"2026-10-02T14:00:00Z"}]}`))
		default:
			_, _ = w.Write([]byte(`{"total":1,"models":[{"id":8,"name":"Old Rank","slug":"old","get_starttimeiso":"2026-01-02T12:00:00Z","get_endtimeiso":"2026-01-02T14:00:00Z"}]}`))
		}
	}))
	defer server.Close()

	src := New(server.URL+"/upcoming", server.URL+"/archived")
	src.now = func() time.Time { return now }
	contests, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(contests) != 1 || contests[0].URL != "https://www.hackerrank.com/contests/hourrank-50" {
		t.Fatalf("%+v", contests)
	}
}
