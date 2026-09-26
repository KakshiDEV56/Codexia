package leetcode

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

func TestFetchKeepsUpcomingAndRecentContests(t *testing.T) {
	now := time.Date(2026, 9, 27, 0, 0, 0, 0, time.UTC)
	upcoming := now.Add(48 * time.Hour).Unix()
	recent := now.Add(-48 * time.Hour).Unix()
	old := now.Add(-90 * 24 * time.Hour).Unix()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("method %s", r.Method)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{"allContests":[
			{"title":"Weekly Contest 521","titleSlug":"weekly-contest-521","startTime":` + strconv.FormatInt(upcoming, 10) + `,"duration":5400},
			{"title":"Weekly Contest 500","titleSlug":"weekly-contest-500","startTime":` + strconv.FormatInt(recent, 10) + `,"duration":5400},
			{"title":"Weekly Contest 1","titleSlug":"weekly-contest-1","startTime":` + strconv.FormatInt(old, 10) + `,"duration":5400}
		]}}`))
	}))
	defer server.Close()

	src := New(server.URL)
	src.now = func() time.Time { return now }

	contests, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(contests) != 2 {
		t.Fatalf("got %d contests", len(contests))
	}
	if contests[0].PlatformID != "weekly-contest-521" || contests[0].Duration != 90*time.Minute {
		t.Fatalf("unexpected first contest: %+v", contests[0])
	}
	if contests[0].URL != "https://leetcode.com/contest/weekly-contest-521" {
		t.Fatalf("url %s", contests[0].URL)
	}
	if domain.Status(contests[0].StartTime, contests[0].EndTime, now) != domain.StatusUpcoming {
		t.Fatal("expected upcoming")
	}
}
