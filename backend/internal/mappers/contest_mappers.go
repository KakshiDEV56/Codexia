package mappers
import (
	"time"
	"github.com/KakshiDEV56/codexia-backend/internal/dtos"
	"github.com/KakshiDEV56/codexia-backend/models"
	"github.com/KakshiDEV56/codexia-backend/utils"
)
func ToContestResponse(c models.Contest) dto.ContestResponse {
	return dto.ContestResponse{
		ID:        c.Platform + "-" + c.PlatformID,
		Platform:  c.Platform,
		Name:      c.Name,
		URL:       c.URL,
		StartTime: c.StartTime.Format(time.RFC3339),
		EndTime:   c.EndTime.Format(time.RFC3339),
		Duration:  c.Duration,
		Status:    utils.GetStatus(c.StartTime, c.EndTime),
	}
}