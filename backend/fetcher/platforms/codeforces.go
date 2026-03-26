package platforms

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
	"github.com/KakshiDEV56/codexia-backend/models"
	"github.com/KakshiDEV56/codexia-backend/utils"
	
)

type CodeforcesFetcher struct{}

type cfResponse struct {
	Status string `json:"status"`
	Result []struct {
		ID              int    `json:"id"`
		Name            string `json:"name"`
		StartTimeSeconds int64 `json:"startTimeSeconds"`
		DurationSeconds int64 `json:"durationSeconds"`
	} `json:"result"`
}

func (f *CodeforcesFetcher) FetchContests(ctx context.Context) ([]models.Contest, error) {
	url := utils.Gotdotenv("CODEFORCE_BASE_URL")

	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)``
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data cfResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	var contests []models.Contest

	for _, c := range data.Result {
		start := time.Unix(c.StartTimeSeconds, 0)
		end := start.Add(time.Duration(c.DurationSeconds) * time.Second)

		contests = append(contests, models.Contest{
			Platform:   "codeforces",
			PlatformID:  fmt.Sprintf("%d", c.ID),
			Name:       c.Name,
			URL:        "https://codeforces.com/contest/" + fmt.Sprintf("%d", c.ID),
			StartTime:  start,
			EndTime:    end,
			Duration:   int(c.DurationSeconds / 60),
		})
	}

	return contests, nil
}