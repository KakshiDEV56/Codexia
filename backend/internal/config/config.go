package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const (
	defaultPort               = "8080"
	defaultPollInterval       = 15 * time.Minute
	defaultLeetCodeURL        = "https://leetcode.com/graphql"
	defaultCodeforcesURL      = "https://codeforces.com/api/contest.list?gym=false"
	defaultCodeforcesRates    = "https://codeforces.com/api/user.ratedList?activeOnly=true"
	defaultCodeChefContests   = "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
	defaultCodeChefRatings    = "https://www.codechef.com/api/ratings/all"
	defaultHackerRankUpcoming = "https://www.hackerrank.com/rest/contests/upcoming"
	defaultHackerRankArchived = "https://www.hackerrank.com/rest/contests/archived"
	defaultGFGEvents          = "https://practiceapi.geeksforgeeks.org/api/vr/events/"
	defaultAtCoderContests    = "https://atcoder.jp/contests/"
	defaultAtCoderRanking     = "https://atcoder.jp/ranking"
)

// Config is process configuration loaded from the environment.
type Config struct {
	Port                  string
	DatabaseURL           string
	PollInterval          time.Duration
	LeetCodeURL           string
	CodeforcesURL         string
	CodeforcesRatingsURL  string
	CodeChefContestsURL   string
	CodeChefRatingsURL    string
	HackerRankUpcomingURL string
	HackerRankArchivedURL string
	GFGEventsURL          string
	AtCoderContestsURL    string
	AtCoderRankingURL     string
}

// Load reads optional .env values and fills defaults for local development.
func Load() Config {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using process environment")
	}

	cfg := Config{
		Port:                  envOr("PORT", defaultPort),
		DatabaseURL:           os.Getenv("DATABASE_URL"),
		PollInterval:          defaultPollInterval,
		LeetCodeURL:           envOr("LEETCODE_GRAPHQL_URL", defaultLeetCodeURL),
		CodeforcesURL:         envOr("CODEFORCES_API_URL", defaultCodeforcesURL),
		CodeforcesRatingsURL:  envOr("CODEFORCES_RATINGS_URL", defaultCodeforcesRates),
		CodeChefContestsURL:   envOr("CODECHEF_CONTESTS_URL", defaultCodeChefContests),
		CodeChefRatingsURL:    envOr("CODECHEF_RATINGS_URL", defaultCodeChefRatings),
		HackerRankUpcomingURL: envOr("HACKERRANK_UPCOMING_URL", defaultHackerRankUpcoming),
		HackerRankArchivedURL: envOr("HACKERRANK_ARCHIVED_URL", defaultHackerRankArchived),
		GFGEventsURL:          envOr("GFG_EVENTS_URL", defaultGFGEvents),
		AtCoderContestsURL:    envOr("ATCODER_CONTESTS_URL", defaultAtCoderContests),
		AtCoderRankingURL:     envOr("ATCODER_RANKING_URL", defaultAtCoderRanking),
	}

	if raw := os.Getenv("POLL_INTERVAL"); raw != "" {
		parsed, err := time.ParseDuration(raw)
		if err != nil {
			log.Printf("invalid POLL_INTERVAL %q, using %s", raw, defaultPollInterval)
		} else {
			cfg.PollInterval = parsed
		}
	}

	return cfg
}

// Addr is the HTTP listen address.
func (c Config) Addr() string {
	return ":" + c.Port
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
