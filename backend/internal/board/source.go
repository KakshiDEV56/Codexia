package board

import (
	"context"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// Source loads a global rating leaderboard for one platform.
// API clients and page crawlers both implement it.
type Source interface {
	Name() string
	Fetch(ctx context.Context) ([]domain.Standing, error)
}
