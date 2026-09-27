package domain

// Standing is one row on a platform rating leaderboard.
// Change and Solved are nil when the platform does not publish them.
type Standing struct {
	Platform   string
	Handle     string
	Rank       int
	Rating     int
	Change     *int
	Solved     *int
	Avatar     string
	ProfileURL string
}
