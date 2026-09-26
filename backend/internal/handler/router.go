package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/KakshiDEV56/codexia-backend/internal/service"
)

// NewRouter exposes health and contest routes.
func NewRouter(contests *service.ContestService) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery(), cors())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	contestHandler := NewContestHandler(contests)
	router.GET("/api/contests", contestHandler.List)
	return router
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
