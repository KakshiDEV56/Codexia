package poller

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/board"
	"github.com/KakshiDEV56/codexia-backend/internal/service"
)

// BoardPoller refreshes rating leaderboards on the same interval as contests.
type BoardPoller struct {
	service  *service.LeaderboardService
	sources  []board.Source
	interval time.Duration
}

// NewBoardPoller builds a leaderboard poller.
func NewBoardPoller(svc *service.LeaderboardService, sources []board.Source, interval time.Duration) *BoardPoller {
	return &BoardPoller{service: svc, sources: sources, interval: interval}
}

// PollOnce fetches every leaderboard and stores the rows that came back.
func (p *BoardPoller) PollOnce(ctx context.Context) {
	for _, src := range p.sources {
		if err := p.pollSource(ctx, src); err != nil {
			log.Printf("poll leaderboard %s: %v", src.Name(), err)
		}
	}
}

// Run repeats leaderboard polling until ctx is cancelled.
func (p *BoardPoller) Run(ctx context.Context) {
	ticker := time.NewTicker(p.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			p.PollOnce(ctx)
		}
	}
}

func (p *BoardPoller) pollSource(ctx context.Context, src board.Source) error {
	standings, err := src.Fetch(ctx)
	if err != nil {
		return err
	}
	if err := p.service.Save(ctx, standings); err != nil {
		return fmt.Errorf("save: %w", err)
	}
	log.Printf("poll leaderboard %s: stored %d standings", src.Name(), len(standings))
	return nil
}
