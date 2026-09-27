package repository

import (
	"context"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// LeaderboardRepository stores the latest top standings for each platform.
type LeaderboardRepository interface {
	ReplaceStandings(ctx context.Context, platform string, standings []domain.Standing) error
	ListStandings(ctx context.Context, platform string) ([]domain.Standing, error)
}
