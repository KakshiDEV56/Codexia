package source

import (
	"context"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// Source loads contests from one platform. API pollers and HTML crawlers both implement it.
type Source interface {
	Name() string
	Fetch(ctx context.Context) ([]domain.Contest, error)
}
