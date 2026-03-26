package platforms

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"github.com/KakshiDEV56/codexia-backend/models"
)

type LeetCodeFetcher struct{}

func (f *LeetCodeFetcher) FetchContests(ctx context.Context) ([]models.Contest, error) {
	query := `{
		"query": "query { allContests { title startTime duration titleSlug } }"
	}`

	req, _ := http.NewRequestWithContext(ctx, "POST", utils.Gotdotenv("LEETCODE_GRAPHQL_URL"), bytes.NewBuffer([]byte(query)))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var raw map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&raw)

	var contests []models.Contest

	return contests, nil
}