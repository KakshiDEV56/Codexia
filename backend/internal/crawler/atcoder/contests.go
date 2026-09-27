package atcoder

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/html"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

// ContestSource crawls the public AtCoder contests page.
type ContestSource struct {
	url    string
	client *http.Client
	now    func() time.Time
}

// NewContests returns an AtCoder contest crawler.
func NewContests(url string) *ContestSource {
	return &ContestSource{
		url:    url,
		client: &http.Client{Timeout: 20 * time.Second},
		now:    time.Now,
	}
}

// Name identifies the platform in logs.
func (s *ContestSource) Name() string {
	return domain.PlatformAtCoder
}

// Fetch reads upcoming, running, and recent contests from the contests page.
func (s *ContestSource) Fetch(ctx context.Context) ([]domain.Contest, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.url, nil)
	if err != nil {
		return nil, fmt.Errorf("build atcoder request: %w", err)
	}
	req.Header.Set("Accept", "text/html")
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Codexia/0.1)")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call atcoder: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("atcoder status %d", resp.StatusCode)
	}

	contests, err := parseContests(io.LimitReader(resp.Body, 4<<20), s.now())
	if err != nil {
		return nil, fmt.Errorf("parse atcoder contests: %w", err)
	}
	return contests, nil
}

func parseContests(r io.Reader, now time.Time) ([]domain.Contest, error) {
	doc, err := html.Parse(r)
	if err != nil {
		return nil, err
	}

	contests := make([]domain.Contest, 0)
	seen := map[string]struct{}{}
	var walk func(*html.Node)
	walk = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "tr" {
			if contest, ok := contestFromRow(n, now); ok {
				if _, exists := seen[contest.PlatformID]; !exists {
					seen[contest.PlatformID] = struct{}{}
					contests = append(contests, contest)
				}
			}
		}
		for child := n.FirstChild; child != nil; child = child.NextSibling {
			walk(child)
		}
	}
	walk(doc)
	return contests, nil
}

func contestFromRow(row *html.Node, now time.Time) (domain.Contest, bool) {
	var startText, href, title, durationText string
	var visit func(*html.Node)
	visit = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "time" && startText == "" {
			startText = strings.TrimSpace(text(n))
		}
		if n.Type == html.ElementNode && n.Data == "a" && href == "" {
			link := attr(n, "href")
			if strings.Contains(link, "/contests/") && !strings.Contains(link, "?") {
				href = link
				title = strings.TrimSpace(text(n))
			}
		}
		if n.Type == html.ElementNode && n.Data == "td" && durationText == "" {
			value := strings.TrimSpace(text(n))
			if durationPattern(value) {
				durationText = value
			}
		}
		for child := n.FirstChild; child != nil; child = child.NextSibling {
			visit(child)
		}
	}
	visit(row)

	if href == "" || title == "" || startText == "" || durationText == "" {
		return domain.Contest{}, false
	}
	start, err := time.Parse("2006-01-02 15:04:05-0700", startText)
	if err != nil {
		return domain.Contest{}, false
	}
	duration, ok := parseClock(durationText)
	if !ok {
		return domain.Contest{}, false
	}
	end := start.Add(duration)
	if !domain.Kept(end, now, domain.RecentContestWindow) {
		return domain.Contest{}, false
	}
	slug := strings.Trim(strings.TrimPrefix(href, "/contests/"), "/")
	if slug == "" {
		return domain.Contest{}, false
	}
	return domain.Contest{
		Platform:   domain.PlatformAtCoder,
		PlatformID: slug,
		Title:      title,
		URL:        "https://atcoder.jp/contests/" + slug,
		StartTime:  start.UTC(),
		EndTime:    end.UTC(),
		Duration:   duration,
	}, true
}

func durationPattern(value string) bool {
	_, ok := parseClock(value)
	return ok
}

func parseClock(value string) (time.Duration, bool) {
	hoursText, minutesText, ok := strings.Cut(value, ":")
	if !ok || strings.Contains(minutesText, ":") {
		return 0, false
	}
	hours, err1 := strconv.Atoi(hoursText)
	minutes, err2 := strconv.Atoi(minutesText)
	if err1 != nil || err2 != nil || minutes >= 60 || hours < 0 {
		return 0, false
	}
	if hours == 0 && minutes == 0 {
		return 0, false
	}
	return time.Duration(hours)*time.Hour + time.Duration(minutes)*time.Minute, true
}

func attr(n *html.Node, key string) string {
	for _, item := range n.Attr {
		if item.Key == key {
			return item.Val
		}
	}
	return ""
}

func text(n *html.Node) string {
	var b strings.Builder
	var walk func(*html.Node)
	walk = func(node *html.Node) {
		if node.Type == html.TextNode {
			b.WriteString(node.Data)
		}
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			walk(child)
		}
	}
	walk(n)
	return b.String()
}
