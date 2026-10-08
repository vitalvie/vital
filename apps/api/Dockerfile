# The Vital API as a container. Build from the repository root:
#   docker build -f apps/api/Dockerfile -t vital-api apps/api
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY vital_api ./vital_api
RUN uv sync --frozen --no-dev

# Hosts set PORT. Secrets come from the environment, never from the image.
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uv run --no-sync uvicorn vital_api.main:app --host 0.0.0.0 --port ${PORT}"]
