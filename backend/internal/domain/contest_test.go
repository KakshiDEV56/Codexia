package domain

import (
	"testing"
	"time"
)

func TestStatusBoundaries(t *testing.T) {
	start := time.Date(2026, 10, 1, 12, 0, 0, 0, time.UTC)
	end := start.Add(time.Hour)
	tests := []struct {
		name string
		now time.Time
		want string
	}{
		{"before start", start.Add(-time.Nanosecond), StatusUpcoming},
		{"exactly at start", start, StatusOngoing},
		{"during contest", start.Add(time.Minute), StatusOngoing},
		{"exactly at end", end, StatusOngoing},
		{"after end", end.Add(time.Nanosecond), StatusPast},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Status(start, end, tt.now); got != tt.want {
				t.Fatalf("Status() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestKeptRetentionBoundary(t *testing.T) {
	now := time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC)
	cutoff := now.Add(-RecentContestWindow)
	tests := []struct {
		name string
		end time.Time
		want bool
	}{
		{"future", now.Add(time.Hour), true},
		{"now", now, true},
		{"exactly at cutoff", cutoff, true},
		{"just older than cutoff", cutoff.Add(-time.Nanosecond), false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Kept(tt.end, now, RecentContestWindow); got != tt.want {
				t.Fatalf("Kept() = %v, want %v", got, tt.want)
			}
		})
	}
}
