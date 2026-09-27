package leetcode

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

const rankingQuery = `query globalRanking($page: Int) {
  globalRanking(page: $page) {
    rankingNodes {
      currentRating
      currentGlobalRanking
      user { username profile { userAvatar } }
    }
  }
}`

// RankingSource loads the LeetCode global contest ranking.
type RankingSource struct {
	url    string
	client *http.Client
}

// NewRanking returns a LeetCode leaderboard source.
func NewRanking(url string) *RankingSource {
	return &RankingSource{
		url:    url,
		client: &http.Client{Timeout: 20 * time.Second},
	}
}

// Name identifies the platform in logs.
func (s *RankingSource) Name() string {
	return domain.PlatformLeetCode
}

type rankingRequest struct {
	Query     string         `json:"query"`
	Variables map[string]int `json:"variables"`
}

type rankingResponse struct {
	Data struct {
		GlobalRanking struct {
			RankingNodes []rankingNode `json:"rankingNodes"`
		} `json:"globalRanking"`
	} `json:"data"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

type rankingNode struct {
	CurrentRating        string `json:"currentRating"`
	CurrentGlobalRanking int    `json:"currentGlobalRanking"`
	User                 struct {
		Username string `json:"username"`
		Profile  struct {
			UserAvatar string `json:"userAvatar"`
		} `json:"profile"`
	} `json:"user"`
}

// Fetch returns the first page of the LeetCode global contest ranking.
func (s *RankingSource) Fetch(ctx context.Context) ([]domain.Standing, error) {
	body, err := json.Marshal(rankingRequest{
		Query:     rankingQuery,
		Variables: map[string]int{"page": 1},
	})
	if err != nil {
		return nil, fmt.Errorf("encode leetcode ranking: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.url, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("build leetcode ranking request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Referer", "https://leetcode.com/contest/globalranking/")
	req.Header.Set("Origin", "https://leetcode.com")
	req.Header.Set("User-Agent", "Codexia/0.1")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call leetcode ranking: %w", err)
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return nil, fmt.Errorf("read leetcode ranking: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("leetcode ranking status %d", resp.StatusCode)
	}

	var decoded rankingResponse
	if err := json.Unmarshal(payload, &decoded); err != nil {
		return nil, fmt.Errorf("decode leetcode ranking: %w", err)
	}
	if len(decoded.Errors) > 0 {
		return nil, fmt.Errorf("leetcode ranking: %s", decoded.Errors[0].Message)
	}

	standings := make([]domain.Standing, 0)
	for _, node := range decoded.Data.GlobalRanking.RankingNodes {
		if node.User.Username == "" || node.CurrentGlobalRanking <= 0 {
			continue
		}
		rating, err := strconv.ParseFloat(node.CurrentRating, 64)
		if err != nil {
			continue
		}
		standings = append(standings, domain.Standing{
			Platform:   domain.PlatformLeetCode,
			Handle:     node.User.Username,
			Rank:       node.CurrentGlobalRanking,
			Rating:     int(math.Round(rating)),
			Avatar:     node.User.Profile.UserAvatar,
			ProfileURL: "https://leetcode.com/u/" + node.User.Username,
		})
	}
	return standings, nil
}
