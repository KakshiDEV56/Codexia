# Backend tests

Run the full backend suite from this directory's parent:

```sh
cd backend
go test ./...
go test -race ./...
go test -coverprofile=coverage.out ./...
go tool cover -func=coverage.out
```

The suite uses deterministic time values, in-memory repositories, and `httptest` servers. It does not require a live database or calls to contest platforms.

Coverage areas include:

- Contest lifecycle boundaries and the recent-contest retention cutoff.
- UTC serialization, duration rounding, and response IDs.
- In-memory upserts, platform-scoped keys, empty results, and defensive copies.
- Service sorting, empty saves, and wrapped repository errors.
- Platform API parsing, invalid records, expired records, HTTP errors, malformed JSON, and upstream API failures.
- HTTP route contracts, CORS/OPTIONS behavior, unsupported leaderboard platforms, and JSON response fields.

Existing package-local tests (including the AtCoder parser tests) remain alongside the code they exercise. Keep tests deterministic and avoid live external network dependencies.
