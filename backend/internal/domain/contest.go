package domain

import "time"

const (
	PlatformLeetCode   = "leetcode"
	PlatformCodeforces = "codeforces"
	PlatformCodeChef   = "codechef"
	PlatformAtCoder    = "atcoder"
	PlatformGFG        = "gfg"
	PlatformHackerRank = "hackerrank"
)

const (
	StatusUpcoming = "upcoming"
	StatusOngoing  = "ongoing"
	StatusPast     = "past"
)

// RecentContestWindow is how far back a finished contest stays in the catalog.
const RecentContestWindow = 30 * 24 * time.Hour

// Contest is a competition on one platform. Duration is the scheduled length.
type Contest struct {
	Platform   string
	PlatformID string
	Title      string
	URL        string
	StartTime  time.Time
	EndTime    time.Time
	Duration   time.Duration
}

// Status reports upcoming, ongoing, or past relative to now.
func Status(start, end, now time.Time) string {
	if now.Before(start) {
		return StatusUpcoming
	}
	if now.After(end) {
		return StatusPast
	}
	return StatusOngoing
}

// Kept reports whether the contest is upcoming, running, or finished inside the window.
func Kept(end, now time.Time, window time.Duration) bool {
	return !end.Before(now.Add(-window))
}
