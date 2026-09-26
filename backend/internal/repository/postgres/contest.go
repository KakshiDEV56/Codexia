package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

const schemaSQL = `
CREATE TABLE IF NOT EXISTS contests (
    platform TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (platform, platform_id)
);`

// Repository stores contests in Postgres. duration is seconds.
type Repository struct {
	pool *pgxpool.Pool
}

// New connects, pings, and creates the contests table when it is missing.
func New(ctx context.Context, databaseURL string) (*Repository, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("connect postgres: %w", err)
	}

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	if _, err := pool.Exec(ctx, schemaSQL); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ensure contests table: %w", err)
	}

	return &Repository{pool: pool}, nil
}

// Close releases the connection pool.
func (r *Repository) Close() {
	r.pool.Close()
}

// UpsertMany inserts or updates contests in one transaction.
func (r *Repository) UpsertMany(ctx context.Context, contests []domain.Contest) error {
	if len(contests) == 0 {
		return nil
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin upsert: %w", err)
	}
	defer tx.Rollback(ctx)

	const query = `
INSERT INTO contests (platform, platform_id, name, url, start_time, end_time, duration, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
ON CONFLICT (platform, platform_id) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    duration = EXCLUDED.duration,
    updated_at = NOW()`

	batch := &pgx.Batch{}
	for _, contest := range contests {
		batch.Queue(query,
			contest.Platform,
			contest.PlatformID,
			contest.Title,
			contest.URL,
			contest.StartTime.UTC(),
			contest.EndTime.UTC(),
			int(contest.Duration.Seconds()),
		)
	}

	results := tx.SendBatch(ctx, batch)
	for range contests {
		if _, err := results.Exec(); err != nil {
			results.Close()
			return fmt.Errorf("upsert contest: %w", err)
		}
	}
	if err := results.Close(); err != nil {
		return fmt.Errorf("close upsert batch: %w", err)
	}
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit upsert: %w", err)
	}
	return nil
}

// List returns every stored contest.
func (r *Repository) List(ctx context.Context) ([]domain.Contest, error) {
	rows, err := r.pool.Query(ctx, `
SELECT platform, platform_id, name, url, start_time, end_time, duration
FROM contests`)
	if err != nil {
		return nil, fmt.Errorf("list contests: %w", err)
	}
	defer rows.Close()

	contests := make([]domain.Contest, 0)
	for rows.Next() {
		var contest domain.Contest
		var durationSeconds int
		if err := rows.Scan(
			&contest.Platform,
			&contest.PlatformID,
			&contest.Title,
			&contest.URL,
			&contest.StartTime,
			&contest.EndTime,
			&durationSeconds,
		); err != nil {
			return nil, fmt.Errorf("scan contest: %w", err)
		}
		contest.Duration = time.Duration(durationSeconds) * time.Second
		contests = append(contests, contest)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate contests: %w", err)
	}
	return contests, nil
}
