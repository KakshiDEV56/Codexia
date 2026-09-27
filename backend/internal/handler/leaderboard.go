package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
	"github.com/KakshiDEV56/codexia-backend/internal/service"
)

// LeaderboardHandler serves rating leaderboard routes.
type LeaderboardHandler struct {
	service *service.LeaderboardService
}

// NewLeaderboardHandler binds leaderboard routes to the leaderboard service.
func NewLeaderboardHandler(svc *service.LeaderboardService) *LeaderboardHandler {
	return &LeaderboardHandler{service: svc}
}

// List writes the stored ranking for one platform.
func (h *LeaderboardHandler) List(c *gin.Context) {
	platform := c.Query("platform")
	if !supportedLeaderboard(platform) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported platform"})
		return
	}

	standings, err := h.service.List(c.Request.Context(), platform)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load leaderboard"})
		return
	}
	c.JSON(http.StatusOK, standings)
}

func supportedLeaderboard(platform string) bool {
	switch platform {
	case domain.PlatformCodeforces, domain.PlatformLeetCode, domain.PlatformCodeChef, domain.PlatformAtCoder:
		return true
	default:
		return false
	}
}
