package poller

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/service"
	"github.com/KakshiDEV56/codexia-backend/internal/source"
)

// Poller refreshes API-backed contest sources on an interval.
type Poller struct {
	service  *service.ContestService
	sources  []source.Source
	interval time.Duration
}

// New builds a poller. Each source is fetched independently so one failure does not drop the others.
func New(svc *service.ContestService, sources []source.Source, interval time.Duration) *Poller {
	return &Poller{service: svc, sources: sources, interval: interval}
}

// PollOnce fetches every source and stores the contests that came back.
func (p *Poller) PollOnce(ctx context.Context) {
	p.poll(ctx)
}

// Run repeats polling until ctx is cancelled. Call PollOnce before serving so the first request has data.
func (p *Poller) Run(ctx context.Context) {
	ticker := time.NewTicker(p.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			p.poll(ctx)
		}
	}
}

func (p *Poller) poll(ctx context.Context) {
	for _, src := range p.sources {
		if err := p.pollSource(ctx, src); err != nil {
			log.Printf("poll %s: %v", src.Name(), err)
		}
	}
}

func (p *Poller) pollSource(ctx context.Context, src source.Source) error {
	contests, err := src.Fetch(ctx)
	if err != nil {
		return err
	}
	if err := p.service.Save(ctx, contests); err != nil {
		return fmt.Errorf("save: %w", err)
	}
	log.Printf("poll %s: stored %d contests", src.Name(), len(contests))
	return nil
}
