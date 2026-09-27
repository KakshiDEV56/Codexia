package codeforces

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

const ratingLimit = 25

// RatingSource loads the top of the Codeforces rated list.
type RatingSource struct {
	url    string
	client *http.Client
}

// NewRatings returns a Codeforces leaderboard source.
func NewRatings(url string) *RatingSource {
	return &RatingSource{
		url: url,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// Name identifies the platform in logs.
func (s *RatingSource) Name() string {
	return domain.PlatformCodeforces
}

type ratedUser struct {
	Handle string `json:"handle"`
	Rating int    `json:"rating"`
	Avatar string `json:"avatar"`
}

// Fetch reads only the highest-rated users. The public list is sorted by rating.
func (s *RatingSource) Fetch(ctx context.Context) ([]domain.Standing, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.url, nil)
	if err != nil {
		return nil, fmt.Errorf("build codeforces ratings request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "Codexia/0.1")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call codeforces ratings: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("codeforces ratings status %d", resp.StatusCode)
	}

	users, status, err := decodeTopRated(resp.Body, ratingLimit)
	if err != nil {
		return nil, fmt.Errorf("decode codeforces ratings: %w", err)
	}
	if status != "OK" {
		return nil, fmt.Errorf("codeforces ratings api: %s", status)
	}

	standings := make([]domain.Standing, 0, len(users))
	for i, user := range users {
		if user.Handle == "" {
			continue
		}
		standings = append(standings, domain.Standing{
			Platform:   domain.PlatformCodeforces,
			Handle:     user.Handle,
			Rank:       i + 1,
			Rating:     user.Rating,
			Avatar:     httpsURL(user.Avatar),
			ProfileURL: "https://codeforces.com/profile/" + user.Handle,
		})
	}
	return standings, nil
}

func httpsURL(raw string) string {
	if strings.HasPrefix(raw, "http://") {
		return "https://" + strings.TrimPrefix(raw, "http://")
	}
	return raw
}

// decodeTopRated stops after limit users so the rest of the multi-megabyte list is not stored.
func decodeTopRated(r io.Reader, limit int) ([]ratedUser, string, error) {
	dec := json.NewDecoder(r)
	token, err := dec.Token()
	if err != nil {
		return nil, "", err
	}
	if delim, ok := token.(json.Delim); !ok || delim != '{' {
		return nil, "", fmt.Errorf("expected object")
	}

	status := ""
	users := make([]ratedUser, 0, limit)
	for dec.More() {
		token, err = dec.Token()
		if err != nil {
			return nil, status, err
		}
		key, ok := token.(string)
		if !ok {
			return nil, status, fmt.Errorf("expected field name")
		}
		switch key {
		case "status":
			if err := dec.Decode(&status); err != nil {
				return nil, status, err
			}
		case "result":
			token, err = dec.Token()
			if err != nil {
				return nil, status, err
			}
			if delim, ok := token.(json.Delim); !ok || delim != '[' {
				return nil, status, fmt.Errorf("expected result array")
			}
			for dec.More() && len(users) < limit {
				var user ratedUser
				if err := dec.Decode(&user); err != nil {
					return nil, status, err
				}
				users = append(users, user)
			}
			return users, status, nil
		default:
			var skip json.RawMessage
			if err := dec.Decode(&skip); err != nil {
				return nil, status, err
			}
		}
	}
	return users, status, nil
}
