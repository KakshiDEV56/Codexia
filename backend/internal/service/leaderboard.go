package service

import (
	"context"
	"fmt"
	"slices"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
	"github.com/KakshiDEV56/codexia-backend/internal/dto"
	"github.com/KakshiDEV56/codexia-backend/internal/mapper"
	"github.com/KakshiDEV56/codexia-backend/internal/repository"
)

// LeaderboardService stores poll results and serves one platform at a time.
type LeaderboardService struct {
	repo repository.LeaderboardRepository
}

// NewLeaderboardService builds a service around a leaderboard repository.
func NewLeaderboardService(repo repository.LeaderboardRepository) *LeaderboardService {
	return &LeaderboardService{repo: repo}
}

// Save replaces the stored ranking for the platform these standings belong to.
func (s *LeaderboardService) Save(ctx context.Context, standings []domain.Standing) error {
	if len(standings) == 0 {
		return nil
	}
	platform := standings[0].Platform
	if err := s.repo.ReplaceStandings(ctx, platform, standings); err != nil {
		return fmt.Errorf("save leaderboard: %w", err)
	}
	return nil
}

// List returns standings ordered by rank.
func (s *LeaderboardService) List(ctx context.Context, platform string) ([]dto.StandingResponse, error) {
	standings, err := s.repo.ListStandings(ctx, platform)
	if err != nil {
		return nil, fmt.Errorf("list leaderboard: %w", err)
	}
	slices.SortFunc(standings, func(a, b domain.Standing) int {
		return a.Rank - b.Rank
	})
	out := make([]dto.StandingResponse, 0, len(standings))
	for _, standing := range standings {
		out = append(out, mapper.ToStandingResponse(standing))
	}
	return out, nil
}
