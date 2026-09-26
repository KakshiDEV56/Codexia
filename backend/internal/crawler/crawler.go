package crawler

import "github.com/KakshiDEV56/codexia-backend/internal/source"

// Crawler collects contests from a platform that does not publish a stable API.
// CodeChef, AtCoder, GeeksforGeeks, and HackerRank will implement this and be
// registered beside the LeetCode and Codeforces pollers.
type Crawler interface {
	source.Source
}

// Registry holds crawlers that have not been given a public endpoint.
type Registry struct {
	crawlers []Crawler
}

// NewRegistry returns the crawlers that should run with the poller.
func NewRegistry(crawlers ...Crawler) *Registry {
	return &Registry{crawlers: crawlers}
}

// Sources returns crawlers as poller sources. The first task registers none.
func (r *Registry) Sources() []source.Source {
	out := make([]source.Source, 0, len(r.crawlers))
	for _, item := range r.crawlers {
		out = append(out, item)
	}
	return out
}
