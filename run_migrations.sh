#!/bin/bash

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-devaios}
DB_USER=${DB_USER:-devaios_user}

# Run all migrations
for migration in migrations/[0-9]*.sql; do
  echo "Running migration: $migration"
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration"
  if [ $? -eq 0 ]; then
    echo "✓ Migration completed"
  else
    echo "✗ Migration failed"
    exit 1
  fi
done

echo "All migrations completed successfully"
