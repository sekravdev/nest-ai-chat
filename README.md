# Chat App

A NestJS + Supabase + Ollama-backed chatbot with conversation logging.

---

## Prerequisites

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Make](https://www.gnu.org/software/make/) (optional but recommended)
- Ensure you have `.env` file with following variables:
```
SUPABASE_URL=http://localhost:8000
PGRST_DB_URI=postgres://postgres:postgres@supabase-db:5432/postgres
PGRST_DB_ANON_ROLE=anon
PGRST_JWT_SECRET=<your_jwt_secret>
```
Note: you can just copy `.env.dist` to your `.env`, it contains variables ready for local environment (including dummy tokens)

# Important! Before your first run:
1. Before your first run - make sure `docker/ollama/bootstrap.sh` is executable.
You can run `make set-permissions` command to grant executables access for the file.
2. Make sure you've created `.env` file (see Prerequisites)
## 1. Running in Production Mode

Build and start all services (Nest API, Supabase/PostgREST, Ollama):

```bash
make prod-up
```
or
```bash
docker-compose -f docker-compose.yml up --build -d
```

* **NestJS API**: [http://localhost:3000](http://localhost:3000)
* **Supabase REST**: [http://localhost:8000](http://localhost:8000)
* **Ollama LLM**: [http://localhost:11434](http://localhost:11434)

To stop and remove containers:

```bash
make prod-down
```
or
```bash
docker-compose down
```

---

## 2. Running in **Development** Mode

Mounts your local code into the Nest container with hot-reload:

```bash
make dev-up
```
or
```bash
docker-compose up --build -d
```

* When you edit `.ts` files, Nest will recompile & restart automatically.

Stop development stack:

```bash
make dev-down
```
or
```bash
docker-compose down
```

Full rebuild (including volumes cleanup):

```bash
make dev-rebuild
```

---

## 3. Test Call to the Chat API

Send a POST to `/chat` with JSON body:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?"}'
```

**Expected JSON response**:

```json
{
  "input":   "Hello, how are you?",
  "intent":  "greeting",
  "response": "Hi there! I'm doing well, thanks for asking.",
  "steps": [
    { "step": "ClassifyIntent",  "result": "greeting" },
    { "step": "GenerateResponse", "result": "Hi there! I'm doing well, thanks for asking." },
    { "step": "LogConversation",  "result": "saved" }
  ]
}
```
**Note**: You can easily view conversation_logs Supabase table content using following command:
```bash
make chat-logs
```

---

## 4. Inspecting `conversation_logs`

All chats are stored in Postgres table `conversation_logs`. To view the most recent entries:

```bash
make chat-logs
```

or:

```bash
docker exec -i supabase-db \
  psql -U postgres -d postgres \
  -c "SELECT * FROM conversation_logs ORDER BY created_at DESC;"
```

Columns:

* `id`        — UUID
* `message`   — user’s text
* `intent`    — classified intent
* `response`  — assistant’s reply
* `created_at`— timestamp

---

## 5. Other Useful `make` Targets

| Target                | What it does                                                            |
|-----------------------|-------------------------------------------------------------------------|
| `make check-model`    | Check whether Ollama has pulled a model (raw output)                    |
| `make check-model-jq` | Check whether Ollama has pulled a model (formats output with `jq`)      |
| `make supabase`       | Open a `psql` shell in the Supabase container                           |
| `make ps`             | List running Docker containers                                          |
| `make logs`           | Tail logs from all services (`nest-app`, `supabase-db`, `ollama`, etc.) |

---

## Ports Summary

| Service           | Port  |
| ----------------- | ----- |
| NestJS API        | 3000  |
| PostgREST         | 8000  |
| Ollama LLM        | 11434 |
| Supabase Postgres | 54322 |
