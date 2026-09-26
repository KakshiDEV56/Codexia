package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/config"
	"github.com/KakshiDEV56/codexia-backend/internal/crawler"
	"github.com/KakshiDEV56/codexia-backend/internal/handler"
	"github.com/KakshiDEV56/codexia-backend/internal/poller"
	"github.com/KakshiDEV56/codexia-backend/internal/repository"
	"github.com/KakshiDEV56/codexia-backend/internal/repository/memory"
	"github.com/KakshiDEV56/codexia-backend/internal/repository/postgres"
	"github.com/KakshiDEV56/codexia-backend/internal/service"
	"github.com/KakshiDEV56/codexia-backend/internal/source"
	"github.com/KakshiDEV56/codexia-backend/internal/source/codeforces"
	"github.com/KakshiDEV56/codexia-backend/internal/source/leetcode"
)

func main() {
	cfg := config.Load()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	repo, closeRepo := openRepository(ctx, cfg.DatabaseURL)
	defer closeRepo()

	contests := service.NewContestService(repo)
	sources := []source.Source{
		leetcode.New(cfg.LeetCodeURL),
		codeforces.New(cfg.CodeforcesURL),
	}
	sources = append(sources, crawler.NewRegistry().Sources()...)

	poll := poller.New(contests, sources, cfg.PollInterval)
	pollCtx, cancelPoll := context.WithTimeout(ctx, 45*time.Second)
	poll.PollOnce(pollCtx)
	cancelPoll()
	go poll.Run(ctx)

	server := &http.Server{
		Addr:              cfg.Addr(),
		Handler:           handler.NewRouter(contests),
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()

	log.Printf("listening on %s", cfg.Addr())
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("server: %v", err)
	}
}

func openRepository(ctx context.Context, databaseURL string) (repository.ContestRepository, func()) {
	if databaseURL == "" {
		log.Println("DATABASE_URL is unset, storing contests in memory")
		return memory.New(), func() {}
	}

	repo, err := postgres.New(ctx, databaseURL)
	if err != nil {
		log.Fatalf("postgres: %v", err)
	}
	log.Println("storing contests in postgres")
	return repo, repo.Close
}
