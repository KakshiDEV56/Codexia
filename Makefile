.DEFAULT_GOAL := run

COMPOSE := docker compose -f backend/docker-compose.yml
DATABASE_URL := postgres://postgres:postgres@localhost:5432/codexia?sslmode=disable
WEB_PORT := 3001

.PHONY: run up down db

# Start Postgres, the API on :8080, and the web app on :3001.
run: db
	@if ss -ltn | grep -q ':8080'; then \
		echo "Freeing port 8080 from the previous API process"; \
		fuser -k 8080/tcp >/dev/null 2>&1 || true; \
		sleep 1; \
	fi
	@echo "Codexia API  http://localhost:8080"
	@echo "Codexia web  http://localhost:$(WEB_PORT)"
	@if [ ! -d node_modules ]; then npm install; fi
	@bash -eu -c 'trap "kill 0" EXIT INT TERM; \
		(cd backend && DATABASE_URL="$(DATABASE_URL)" go run ./cmd/server) & \
		npm run dev -- --port $(WEB_PORT) & \
		wait'

up: run

# Start Postgres and wait until it accepts connections.
db:
	$(COMPOSE) up -d
	@echo "Waiting for Postgres..."
	@for i in $$(seq 1 30); do \
		status=$$(docker inspect --format '{{.State.Health.Status}}' codexia-postgres 2>/dev/null || true); \
		if [ "$$status" = "healthy" ]; then \
			echo "Postgres is ready"; \
			exit 0; \
		fi; \
		sleep 1; \
	done; \
	echo "Postgres did not become healthy"; \
	exit 1

# Stop the Postgres container. Ctrl-C stops the API and the web app.
down:
	$(COMPOSE) down
