package service

import (
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
	"github.com/KakshiDEV56/codexia-backend/internal/dto"
	"github.com/KakshiDEV56/codexia-backend/internal/mapper"
	"github.com/KakshiDEV56/codexia-backend/internal/repository"
)

// ContestService reads contests for the API and stores poll results.
type ContestService struct {
	repo repository.ContestRepository
	now  func() time.Time
}

// NewContestService builds a service around a contest repository.
func NewContestService(repo repository.ContestRepository) *ContestService {
	return &ContestService{repo: repo, now: time.Now}
}

// Save persists contests fetched by a poller or crawler.
func (s *ContestService) Save(ctx context.Context, contests []domain.Contest) error {
	if err := s.repo.UpsertMany(ctx, contests); err != nil {
		return fmt.Errorf("save contests: %w", err)
	}
	return nil
}

// List returns contests in start-time order using the frontend response shape.
func (s *ContestService) List(ctx context.Context) ([]dto.ContestResponse, error) {
	contests, err := s.repo.List(ctx)
	if err != nil {
		return nil, fmt.Errorf("list contests: %w", err)
	}

	slices.SortFunc(contests, func(a, b domain.Contest) int {
		return a.StartTime.Compare(b.StartTime)
	})

	now := s.now()
	out := make([]dto.ContestResponse, 0, len(contests))
	for _, contest := range contests {
		out = append(out, mapper.ToContestResponse(contest, now))
	}
	return out, nil
}
