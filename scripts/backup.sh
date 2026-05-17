#!/usr/bin/env bash
set -euo pipefail

# PostgreSQL backup script for PFE-Navigator
# Usage: ./scripts/backup.sh [output_dir]
# Requires: pg_dump, gzip, docker (if using docker-compose setup)

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/pfe_navigator_${TIMESTAMP}.sql.gz"

DB_NAME="${DB_NAME:-pfe_navigator}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

mkdir -p "$BACKUP_DIR"

echo "Starting backup → ${BACKUP_FILE}"

# Try docker-compose first; fall back to direct pg_dump
if docker compose ps db 2>/dev/null | grep -q "running"; then
  docker compose exec -T db pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-password \
    | gzip > "$BACKUP_FILE"
else
  PGPASSWORD="${DB_PASSWORD:-}" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    | gzip > "$BACKUP_FILE"
fi

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "Backup complete: ${BACKUP_FILE} (${SIZE})"

# Retain only last 30 backups
find "$BACKUP_DIR" -name "pfe_navigator_*.sql.gz" \
  | sort -r | tail -n +31 | xargs -r rm --
