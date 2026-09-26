package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/KakshiDEV56/codexia-backend/internal/service"
)

// ContestHandler serves contest HTTP routes.
type ContestHandler struct {
	service *service.ContestService
}

// NewContestHandler binds contest routes to the contest service.
func NewContestHandler(svc *service.ContestService) *ContestHandler {
	return &ContestHandler{service: svc}
}

// List writes the contests the frontend renders.
func (h *ContestHandler) List(c *gin.Context) {
	contests, err := h.service.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load contests"})
		return
	}
	c.JSON(http.StatusOK, contests)
}
