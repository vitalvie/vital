#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/apps/api"
uv sync --extra dev
uv run uvicorn vital_api.main:app --host 127.0.0.1 --port 8000 &
api_pid=$!
cleanup() {
	kill "$api_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _ in $(seq 1 50); do
	if curl -sf http://127.0.0.1:8000/health >/dev/null; then
		break
	fi
	sleep 0.1
done

cd "$root"
pnpm --filter web dev
