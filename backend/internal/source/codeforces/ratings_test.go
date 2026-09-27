package codeforces

import (
	"strings"
	"testing"
)

func TestDecodeTopRatedStopsEarly(t *testing.T) {
	payload := `{"status":"OK","result":[{"handle":"Benq","rating":3676,"avatar":"https://img/a.png"},{"handle":"Kevin","rating":3655},{"handle":"third","rating":1}]}`
	users, status, err := decodeTopRated(strings.NewReader(payload), 2)
	if err != nil {
		t.Fatal(err)
	}
	if status != "OK" || len(users) != 2 || users[0].Handle != "Benq" {
		t.Fatalf("status %s users %+v", status, users)
	}
}
