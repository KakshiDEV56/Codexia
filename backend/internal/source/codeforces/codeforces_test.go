package codeforces

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"
)

func TestFetchSkipsUnscheduledAndOldContests(t *testing.T) {
	now := time.Date(2026, 9, 27, 0, 0, 0, 0, time.UTC)
	upcoming := now.Add(24 * time.Hour).Unix()
	old := now.Add(-90 * 24 * time.Hour).Unix()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"OK","result":[
			{"id":2261,"name":"Codeforces Round","phase":"BEFORE","durationSeconds":10800,"startTimeSeconds":` + strconv.FormatInt(upcoming, 10) + `},
			{"id":1,"name":"Unscheduled","phase":"BEFORE","durationSeconds":7200},
			{"id":100,"name":"Old Round","phase":"FINISHED","durationSeconds":7200,"startTimeSeconds":` + strconv.FormatInt(old, 10) + `}
		]}`))
	}))
	defer server.Close()

	src := New(server.URL)
	src.now = func() time.Time { return now }

	contests, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(contests) != 1 {
		t.Fatalf("got %d contests", len(contests))
	}
	if contests[0].PlatformID != "2261" || contests[0].Duration != 3*time.Hour {
		t.Fatalf("unexpected contest: %+v", contests[0])
	}
	if contests[0].URL != "https://codeforces.com/contest/2261" {
		t.Fatalf("url %s", contests[0].URL)
	}
}
