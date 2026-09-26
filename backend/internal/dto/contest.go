package dto

// ContestResponse is the contest shape the Next.js app already renders.
type ContestResponse struct {
	ID        string  `json:"id"`
	Platform  string  `json:"platform"`
	Title     string  `json:"title"`
	StartTime string  `json:"startTime"`
	EndTime   string  `json:"endTime"`
	Duration  float64 `json:"duration"`
	Status    string  `json:"status"`
	URL       string  `json:"url"`
}
