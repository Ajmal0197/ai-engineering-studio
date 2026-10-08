# Multi-stage build using official uv binary
FROM ghcr.io/astral-sh/uv:latest AS uv_bin
FROM python:3.12-slim

WORKDIR /app

# Copy uv binary into image
COPY --from=uv_bin /uv /uvx /bin/

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# Install dependencies using uv and lockfile for fast, deterministic builds
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project

# Copy remaining source code, assets, and templates
COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uv run uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}"]
