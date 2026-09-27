package codechef

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestFetchContestsKeepsRecentRounds(t *testing.T) {
	now := time.Date(2026, 9, 27, 12, 0, 0, 0, time.UTC)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{
			"status":"success",
			"present_contests":[{"contest_code":"LIVE1","contest_name":"Live Round","contest_start_date_iso":"2026-09-27T10:00:00+05:30","contest_end_date_iso":"2026-09-27T20:00:00+05:30"}],
			"future_contests":[{"contest_code":"START258","contest_name":"Starters 258","contest_start_date_iso":"2026-09-30T20:00:00+05:30","contest_end_date_iso":"2026-09-30T22:00:00+05:30"}],
			"past_contests":[{"contest_code":"OLD","contest_name":"Old","contest_start_date_iso":"2026-01-01T20:00:00+05:30","contest_end_date_iso":"2026-01-01T22:00:00+05:30"}]
		}`))
	}))
	defer server.Close()

	src := NewContests(server.URL)
	src.now = func() time.Time { return now }
	contests, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(contests) != 2 {
		t.Fatalf("got %d contests", len(contests))
	}
	if contests[1].URL != "https://www.codechef.com/START258" || contests[1].Duration != 2*time.Hour {
		t.Fatalf("unexpected contest %+v", contests[1])
	}
}

func TestFetchRatingsSendsSessionToken(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/ratings/all":
			http.SetCookie(w, &http.Cookie{Name: "session", Value: "abc"})
			_, _ = w.Write([]byte(`window.csrfToken = "abc123";`))
		default:
			if r.Header.Get("x-csrf-token") != "abc123" {
				http.Error(w, "missing token", http.StatusForbidden)
				return
			}
			_, _ = w.Write([]byte(`{"list":[{"username":"gennady.korotkevich","global_rank":1,"rating":3355}]}`))
		}
	}))
	defer server.Close()

	src := NewRatings(server.URL + "/api")
	src.pageURL = server.URL + "/ratings/all"
	src.profileBase = ""
	standings, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(standings) != 1 || standings[0].Handle != "gennady.korotkevich" {
		t.Fatalf("%+v", standings)
	}
}

func TestFetchRatings(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("sortBy") != "global_rank" {
			t.Fatalf("query %s", r.URL.RawQuery)
		}
		_, _ = w.Write([]byte(`{"list":[{"username":"gennady","global_rank":1,"rating":3800}]}`))
	}))
	defer server.Close()

	src := NewRatings(server.URL)
	src.pageURL = ""
	src.profileBase = ""
	standings, err := src.Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(standings) != 1 || standings[0].Handle != "gennady" || standings[0].ProfileURL != "https://www.codechef.com/users/gennady" {
		t.Fatalf("%+v", standings)
	}
}

func TestProfileImage(t *testing.T) {
	page := `<img class='profileImage' src='https://cdn.codechef.com/user.jpg' width='70px'/>`
	if got := profileImage(page); got != "https://cdn.codechef.com/user.jpg" {
		t.Fatalf("got %s", got)
	}
}
