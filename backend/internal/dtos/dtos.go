package dto

type ContestResponse struct {
	ID         string `json:"id"`       
	Platform   string `json:"platform"`  
	Name       string `json:"name"`
	URL        string `json:"url"`

	StartTime  string `json:"startTime"`
	EndTime    string `json:"endTime"`

	Duration   int    `json:"duration"`  
	Status     string `json:"status"`  
}