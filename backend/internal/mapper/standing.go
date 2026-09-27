package mapper

import (
	"github.com/KakshiDEV56/codexia-backend/internal/domain"
	"github.com/KakshiDEV56/codexia-backend/internal/dto"
)

// ToStandingResponse maps a stored ranking row onto the frontend contract.
func ToStandingResponse(s domain.Standing) dto.StandingResponse {
	return dto.StandingResponse{
		Rank:       s.Rank,
		Handle:     s.Handle,
		Avatar:     s.Avatar,
		Rating:     s.Rating,
		Change:     s.Change,
		Solved:     s.Solved,
		Platform:   s.Platform,
		ProfileURL: s.ProfileURL,
	}
}
