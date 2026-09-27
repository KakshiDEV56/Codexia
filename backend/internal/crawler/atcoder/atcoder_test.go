package atcoder

import (
	"strings"
	"testing"
	"time"
)

func TestParseContests(t *testing.T) {
	now := time.Date(2026, 9, 27, 0, 0, 0, 0, time.UTC)
	page := `<table><tr>
		<td><time>2026-10-03 21:00:00+0900</time></td>
		<td><a href="/contests/abc478">AtCoder Beginner Contest 478</a></td>
		<td>01:40</td>
	</tr></table>`
	contests, err := parseContests(strings.NewReader(page), now)
	if err != nil {
		t.Fatal(err)
	}
	if len(contests) != 1 {
		t.Fatalf("got %d", len(contests))
	}
	if contests[0].PlatformID != "abc478" || contests[0].Duration != 100*time.Minute {
		t.Fatalf("%+v", contests[0])
	}
	if contests[0].URL != "https://atcoder.jp/contests/abc478" {
		t.Fatalf("url %s", contests[0].URL)
	}
}

func TestParseRanking(t *testing.T) {
	page := `<table><tr>
		<td>1</td>
		<td><a href="/users/tourist" class="username"><span>tourist</span></a></td>
		<td>1994</td>
		<td><b>3797</b></td>
		<td><b>4229</b></td>
	</tr></table>`
	standings, err := parseRanking(strings.NewReader(page))
	if err != nil {
		t.Fatal(err)
	}
	if len(standings) != 1 || standings[0].Handle != "tourist" || standings[0].Rating != 3797 {
		t.Fatalf("%+v", standings)
	}
	if standings[0].ProfileURL != "https://atcoder.jp/users/tourist" {
		t.Fatalf("url %s", standings[0].ProfileURL)
	}
}

func TestAvatarFromProfile(t *testing.T) {
	page := `<img class='avatar' src='https://img.atcoder.jp/icons/abc.jpg' width='128'>`
	if got := avatarFromProfile(page); got != "https://img.atcoder.jp/icons/abc.jpg" {
		t.Fatalf("got %s", got)
	}
	page = `<img class="avatar" src="//img.atcoder.jp/icons/rel.png">`
	if got := avatarFromProfile(page); got != "https://img.atcoder.jp/icons/rel.png" {
		t.Fatalf("got %s", got)
	}
}
