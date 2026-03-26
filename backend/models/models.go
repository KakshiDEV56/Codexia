package models

import "time"

type Contest struct {
	PlatformID        string    `json:"id"`       // platform_id
	Platform  string    `json:"platform"`
	Name      string    `json:"name"`
	URL       string    `json:"url"`

	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
	Duration  int       `json:"duration"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}