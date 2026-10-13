package service

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

type leaderboardRepoStub struct {
	rows []domain.Standing
	listErr error
	saveErr error
	savedPlatform string
	saved []domain.Standing
}
func (r *leaderboardRepoStub) ReplaceStandings(_ context.Context, platform string, rows []domain.Standing) error {
	r.savedPlatform = platform
	r.saved = append([]domain.Standing(nil), rows...)
	return r.saveErr
}
func (r *leaderboardRepoStub) ListStandings(_ context.Context, platform string) ([]domain.Standing, error) {
	if r.listErr != nil { return nil, r.listErr }
	if platform != "codeforces" { return []domain.Standing{}, nil }
	return append([]domain.Standing(nil), r.rows...), nil
}

func TestLeaderboardListSortsByRank(t *testing.T) {
	repo := &leaderboardRepoStub{rows: []domain.Standing{
		{Platform: "codeforces", Handle: "third", Rank: 3},
		{Platform: "codeforces", Handle: "first", Rank: 1},
		{Platform: "codeforces", Handle: "second", Rank: 2},
	}}
	got, err := NewLeaderboardService(repo).List(context.Background(), "codeforces")
	if err != nil { t.Fatal(err) }
	if len(got) != 3 { t.Fatalf("got %d rows", len(got)) }
	for i, handle := range []string{"first", "second", "third"} {
		if got[i].Handle != handle { t.Fatalf("row %d handle = %q, want %q", i, got[i].Handle, handle) }
	}
}

func TestLeaderboardSaveEmptyBatchDoesNotOverwrite(t *testing.T) {
	repo := &leaderboardRepoStub{}
	if err := NewLeaderboardService(repo).Save(context.Background(), nil); err != nil { t.Fatal(err) }
	if repo.savedPlatform != "" || repo.saved != nil { t.Fatalf("empty save mutated repository: %+v", repo) }
}

func TestLeaderboardSaveUsesFirstRowPlatformAndWrapsErrors(t *testing.T) {
	boom := errors.New("store failed")
	repo := &leaderboardRepoStub{saveErr: boom}
	rows := []domain.Standing{{Platform: "atcoder", Handle: "tourist", Rank: 1}}
	err := NewLeaderboardService(repo).Save(context.Background(), rows)
	if !errors.Is(err, boom) || !strings.Contains(err.Error(), "save leaderboard") { t.Fatalf("error = %v", err) }
	if repo.savedPlatform != "atcoder" { t.Fatalf("platform = %q", repo.savedPlatform) }
}

func TestLeaderboardListWrapsRepositoryErrors(t *testing.T) {
	boom := errors.New("store unavailable")
	_, err := NewLeaderboardService(&leaderboardRepoStub{listErr: boom}).List(context.Background(), "codeforces")
	if !errors.Is(err, boom) || !strings.Contains(err.Error(), "list leaderboard") { t.Fatalf("error = %v", err) }
}
