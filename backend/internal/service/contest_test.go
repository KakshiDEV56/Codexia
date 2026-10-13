package service

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/KakshiDEV56/codexia-backend/internal/domain"
)

type contestRepoStub struct {
	contests []domain.Contest
	listErr error
	upsertErr error
	saved []domain.Contest
}
func (r *contestRepoStub) UpsertMany(_ context.Context, contests []domain.Contest) error {
	r.saved = append([]domain.Contest(nil), contests...)
	return r.upsertErr
}
func (r *contestRepoStub) List(context.Context) ([]domain.Contest, error) {
	return append([]domain.Contest(nil), r.contests...), r.listErr
}

func TestContestServiceListSortsAndMapsStatuses(t *testing.T) {
	now := time.Date(2026, 10, 1, 12, 0, 0, 0, time.UTC)
	repo := &contestRepoStub{contests: []domain.Contest{
		{Platform: "x", PlatformID: "late", Title: "late", StartTime: now.Add(time.Hour), EndTime: now.Add(2*time.Hour), Duration: time.Hour},
		{Platform: "x", PlatformID: "past", Title: "past", StartTime: now.Add(-2*time.Hour), EndTime: now.Add(-time.Hour), Duration: time.Hour},
		{Platform: "x", PlatformID: "running", Title: "running", StartTime: now.Add(-time.Minute), EndTime: now.Add(time.Minute), Duration: 2*time.Minute},
	}}
	svc := NewContestService(repo)
	svc.now = func() time.Time { return now }
	got, err := svc.List(context.Background())
	if err != nil { t.Fatal(err) }
	if len(got) != 3 { t.Fatalf("got %d responses", len(got)) }
	wantIDs := []string{"x-past", "x-running", "x-late"}
	wantStatuses := []string{domain.StatusPast, domain.StatusOngoing, domain.StatusUpcoming}
	for i := range got {
		if got[i].ID != wantIDs[i] || got[i].Status != wantStatuses[i] {
			t.Fatalf("item %d = %+v; want ID %q and status %q", i, got[i], wantIDs[i], wantStatuses[i])
		}
	}
}

func TestContestServiceWrapsRepositoryErrors(t *testing.T) {
	boom := errors.New("database unavailable")
	svc := NewContestService(&contestRepoStub{listErr: boom})
	_, err := svc.List(context.Background())
	if !errors.Is(err, boom) || !strings.Contains(err.Error(), "list contests") {
		t.Fatalf("List error = %v, want wrapped repository error", err)
	}
	svc = NewContestService(&contestRepoStub{upsertErr: boom})
	err = svc.Save(context.Background(), nil)
	if !errors.Is(err, boom) || !strings.Contains(err.Error(), "save contests") {
		t.Fatalf("Save error = %v, want wrapped repository error", err)
	}
}

func TestContestServiceSavePassesEmptyBatch(t *testing.T) {
	repo := &contestRepoStub{}
	if err := NewContestService(repo).Save(context.Background(), []domain.Contest{}); err != nil { t.Fatal(err) }
	if len(repo.saved) != 0 { t.Fatalf("saved batch = %#v", repo.saved) }
}
