package memory

import (
	"context"
	"sync"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// Repository keeps contests and leaderboards in process memory. It is the store
// used when DATABASE_URL is unset.
type Repository struct {
	mu        sync.RWMutex
	contests  map[string]domain.Contest
	standings map[string][]domain.Standing
}

// New returns an empty in-memory store.
func New() *Repository {
	return &Repository{
		contests:  make(map[string]domain.Contest),
		standings: make(map[string][]domain.Standing),
	}
}

func key(c domain.Contest) string {
	return c.Platform + "\x00" + c.PlatformID
}

// UpsertMany inserts or replaces contests by platform and platform id.
func (r *Repository) UpsertMany(_ context.Context, contests []domain.Contest) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, contest := range contests {
		r.contests[key(contest)] = contest
	}
	return nil
}

// List returns every stored contest.
func (r *Repository) List(_ context.Context) ([]domain.Contest, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	out := make([]domain.Contest, 0, len(r.contests))
	for _, contest := range r.contests {
		out = append(out, contest)
	}
	return out, nil
}

// ReplaceStandings swaps the saved ranking for one platform.
func (r *Repository) ReplaceStandings(_ context.Context, platform string, standings []domain.Standing) error {
	copied := make([]domain.Standing, len(standings))
	copy(copied, standings)
	r.mu.Lock()
	defer r.mu.Unlock()
	r.standings[platform] = copied
	return nil
}

// ListStandings returns the saved ranking for one platform.
func (r *Repository) ListStandings(_ context.Context, platform string) ([]domain.Standing, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]domain.Standing, len(r.standings[platform]))
	copy(out, r.standings[platform])
	return out, nil
}
