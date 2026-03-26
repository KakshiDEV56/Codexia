package fetcher

import (
	"context"
	"github.com/KakshiDEV56/codexia-backend/models"
)

type Fetcher interface {
	FetchContests(ctx context.Context) ([]models.Contest, error)
}