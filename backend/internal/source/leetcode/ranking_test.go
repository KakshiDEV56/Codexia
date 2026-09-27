package leetcode

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestFetchRanking(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("method %s", r.Method)
		}
		_, _ = w.Write([]byte(`{"data":{"globalRanking":{"rankingNodes":[{"currentRating":"3702.788","currentGlobalRanking":1,"user":{"username":"fjzzq2002","profile":{"userAvatar":"https://assets.leetcode.com/a.png"}}}]}}}`))
	}))
	defer server.Close()

	standings, err := NewRanking(server.URL).Fetch(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(standings) != 1 || standings[0].Handle != "fjzzq2002" || standings[0].Rating != 3703 {
		t.Fatalf("%+v", standings)
	}
	if standings[0].ProfileURL != "https://leetcode.com/u/fjzzq2002" {
		t.Fatalf("url %s", standings[0].ProfileURL)
	}
}
