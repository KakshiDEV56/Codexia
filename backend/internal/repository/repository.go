package repository

import (
	"context"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// ContestRepository stores contests fetched from platforms.
type ContestRepository interface {
	UpsertMany(ctx context.Context, contests []domain.Contest) error
	List(ctx context.Context) ([]domain.Contest, error)
}
