package dto

// StandingResponse matches the leaderboard table in the frontend.
type StandingResponse struct {
	Rank       int    `json:"rank"`
	Handle     string `json:"handle"`
	Avatar     string `json:"avatar"`
	Rating     int    `json:"rating"`
	Change     *int   `json:"change"`
	Solved     *int   `json:"solved"`
	Platform   string `json:"platform"`
	ProfileURL string `json:"profileUrl"`
}
