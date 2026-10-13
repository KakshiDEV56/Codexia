package test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/KakshiDEV56/codexia-backend/internal/domain"
	"github.com/KakshiDEV56/codexia-backend/internal/handler"
	"github.com/KakshiDEV56/codexia-backend/internal/repository/memory"
	"github.com/KakshiDEV56/codexia-backend/internal/service"
)

func newTestRouter(t *testing.T) *gin.Engine {
	t.Helper()
	gin.SetMode(gin.TestMode)
	repo := memory.New()
	now := time.Now().UTC()
	err := repo.UpsertMany(context.Background(), []domain.Contest{
		{
			Platform:  domain.PlatformCodeforces,
			PlatformID: "2001",
			Title:     "Upcoming round",
			URL:       "https://codeforces.com/contest/2001",
			StartTime: now.Add(time.Hour),
			EndTime:   now.Add(2 * time.Hour),
			Duration:  time.Hour,
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := repo.ReplaceStandings(context.Background(), domain.PlatformCodeforces, []domain.Standing{
		{
			Platform:  domain.PlatformCodeforces,
			Handle:    "tourist",
			Rank:      1,
			Rating:    3800,
			ProfileURL: "https://codeforces.com/profile/tourist",
		},
	}); err != nil {
		t.Fatal(err)
	}
	return handler.NewRouter(service.NewContestService(repo), service.NewLeaderboardService(repo))
}

func request(router http.Handler, method, path string) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, nil)
	router.ServeHTTP(recorder, req)
	return recorder
}

func TestHealthEndpointAndCORS(t *testing.T) {
	router := newTestRouter(t)
	recorder := request(router, http.MethodGet, "/health")
	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, body=%s", recorder.Code, recorder.Body.String())
	}
	var payload map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if payload["status"] != "ok" {
		t.Fatalf("payload = %#v", payload)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "*" {
		t.Fatalf("CORS origin = %q", got)
	}

	options := request(router, http.MethodOptions, "/api/contests")
	if options.Code != http.StatusNoContent {
		t.Fatalf("OPTIONS status = %d", options.Code)
	}
}

func TestContestEndpointContract(t *testing.T) {
	router := newTestRouter(t)
	recorder := request(router, http.MethodGet, "/api/contests")
	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, body=%s", recorder.Code, recorder.Body.String())
	}
	var payload []map[string]any
	if err := json.Unmarshal(recorder.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload) != 1 {
		t.Fatalf("got %d contests: %s", len(payload), recorder.Body.String())
	}
	contest := payload[0]
	if contest["id"] != "codeforces-2001" || contest["platform"] != domain.PlatformCodeforces || contest["status"] != domain.StatusUpcoming {
		t.Fatalf("unexpected contest payload: %#v", contest)
	}
	for _, key := range []string{"title", "url", "startTime", "endTime", "duration"} {
		if _, ok := contest[key]; !ok {
			t.Errorf("response missing %q: %#v", key, contest)
		}
	}
}

func TestLeaderboardEndpointValidatesPlatformAndReturnsRows(t *testing.T) {
	router := newTestRouter(t)
	bad := request(router, http.MethodGet, "/api/leaderboard")
	if bad.Code != http.StatusBadRequest {
		t.Fatalf("missing platform status = %d", bad.Code)
	}
	bad = request(router, http.MethodGet, "/api/leaderboard?platform=unknown")
	if bad.Code != http.StatusBadRequest {
		t.Fatalf("unsupported platform status = %d", bad.Code)
	}

	good := request(router, http.MethodGet, "/api/leaderboard?platform=codeforces")
	if good.Code != http.StatusOK {
		t.Fatalf("status = %d, body=%s", good.Code, good.Body.String())
	}
	var rows []map[string]any
	if err := json.Unmarshal(good.Body.Bytes(), &rows); err != nil {
		t.Fatal(err)
	}
	if len(rows) != 1 || rows[0]["handle"] != "tourist" || rows[0]["rank"] != float64(1) {
		t.Fatalf("unexpected leaderboard payload: %#v", rows)
	}
}
