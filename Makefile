COMPOSE_DEV=docker-compose
COMPOSE_PROD=docker-compose -f docker-compose.yml

dev-up:
	$(COMPOSE_DEV) up --build

dev-down:
	$(COMPOSE_DEV) down

dev-rebuild:
	$(COMPOSE_DEV) down -v --remove-orphans
	$(COMPOSE_DEV) up --build

prod-up:
	$(COMPOSE_PROD) up --build -d

prod-down:
	$(COMPOSE_PROD) down

supabase:
	docker exec -it supabase-db psql -U postgres -d postgres

supabase-logs:
	docker logs supabase-db

chat-logs:
	docker exec -i supabase-db psql -U postgres -d postgres -c "SELECT * FROM conversation_logs ORDER BY created_at DESC;"

ollama:
	docker exec -it ollama sh

ps:
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

logs:
	docker-compose logs -f --tail=100

set-permissions:
	./set-permissions.sh

check-model:
	curl -s http://localhost:11434/api/tags

check-model-jq:
	curl -s http://localhost:11434/api/tags | jq

