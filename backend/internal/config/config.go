package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const (
	defaultPort          = "8080"
	defaultPollInterval  = 15 * time.Minute
	defaultLeetCodeURL   = "https://leetcode.com/graphql"
	defaultCodeforcesURL = "https://codeforces.com/api/contest.list?gym=false"
)

// Config is process configuration loaded from the environment.
type Config struct {
	Port          string
	DatabaseURL   string
	PollInterval  time.Duration
	LeetCodeURL   string
	CodeforcesURL string
}

// Load reads optional .env values and fills defaults for local development.
func Load() Config {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using process environment")
	}

	cfg := Config{
		Port:          envOr("PORT", defaultPort),
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		PollInterval:  defaultPollInterval,
		LeetCodeURL:   envOr("LEETCODE_GRAPHQL_URL", defaultLeetCodeURL),
		CodeforcesURL: envOr("CODEFORCES_API_URL", defaultCodeforcesURL),
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
