package memory

import (
	"context"
	"testing"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

func TestUpsertManyUsesPlatformAndPlatformID(t *testing.T) {
	repo := New()
	ctx := context.Background()
	start := time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC)
	input := []domain.Contest{
		{Platform: "alpha", PlatformID: "1", Title: "old", StartTime: start},
		{Platform: "alpha", PlatformID: "1", Title: "updated", StartTime: start.Add(time.Hour)},
		{Platform: "beta", PlatformID: "1", Title: "different platform", StartTime: start},
	}
	if err := repo.UpsertMany(ctx, input); err != nil {
		t.Fatal(err)
	}
	got, err := repo.List(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 {
		t.Fatalf("got %d contests, want 2: %+v", len(got), got)
	}
	byKey := map[string]domain.Contest{}
	for _, c := range got {
		byKey[c.Platform+"/"+c.PlatformID] = c
	}
	if byKey["alpha/1"].Title != "updated" {
		t.Fatalf("upsert did not replace value: %+v", byKey["alpha/1"])
	}
	if byKey["beta/1"].Title != "different platform" {
		t.Fatalf("platform key collision: %+v", byKey["beta/1"])
	}
}

func TestEmptyRepositoryReturnsNonNilEmptySlice(t *testing.T) {
	got, err := New().List(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if got == nil || len(got) != 0 {
		t.Fatalf("List() = %#v, want non-nil empty slice", got)
	}
}

func TestReplaceStandingsCopiesInputAndOutput(t *testing.T) {
	repo := New()
	ctx := context.Background()
	input := []domain.Standing{{Platform: "codeforces", Handle: "tourist", Rank: 1}}
	if err := repo.ReplaceStandings(ctx, "codeforces", input); err != nil {
		t.Fatal(err)
	}
	input[0].Handle = "mutated input"
	first, err := repo.ListStandings(ctx, "codeforces")
	if err != nil {
		t.Fatal(err)
	}
	if first[0].Handle != "tourist" {
		t.Fatalf("input mutation leaked into store: %+v", first[0])
	}
	first[0].Handle = "mutated output"
	second, err := repo.ListStandings(ctx, "codeforces")
	if err != nil {
		t.Fatal(err)
	}
	if second[0].Handle != "tourist" {
		t.Fatalf("output mutation leaked into store: %+v", second[0])
	}
}

func TestListStandingsUnknownPlatformIsEmpty(t *testing.T) {
	got, err := New().ListStandings(context.Background(), "missing")
	if err != nil {
		t.Fatal(err)
	}
	if got == nil || len(got) != 0 {
		t.Fatalf("ListStandings() = %#v, want non-nil empty slice", got)
	}
}
