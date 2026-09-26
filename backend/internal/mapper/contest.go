package mapper

import (
	"math"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
	"github.com/KakshiDEV56/codexia-backend/internal/dto"
)

// ToContestResponse maps a stored contest onto the frontend contract.
// Duration is hours, matching the table and timeline.
func ToContestResponse(c domain.Contest, now time.Time) dto.ContestResponse {
	hours := math.Round(c.Duration.Hours()*100) / 100
	return dto.ContestResponse{
		ID:        c.Platform + "-" + c.PlatformID,
		Platform:  c.Platform,
		Title:     c.Title,
		URL:       c.URL,
		StartTime: c.StartTime.UTC().Format(time.RFC3339),
		EndTime:   c.EndTime.UTC().Format(time.RFC3339),
		Duration:  hours,
		Status:    domain.Status(c.StartTime, c.EndTime, now),
	}
}
