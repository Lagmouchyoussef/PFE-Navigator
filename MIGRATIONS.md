"""
Database Migration Guide

This document explains how to manage database schema changes.
"""

# Initial Setup

## 1. Create Initial Migrations

After setting up the project for the first time, create migrations for all apps:

```bash
cd Backend
python manage.py makemigrations
python manage.py migrate
```

## 2. Create Superuser

After migrations complete, create an admin user:

```bash
python manage.py createsuperuser
```

Then access Django admin at: http://localhost:8000/admin


# Making Schema Changes

## Adding a New Field to a Model

1. Edit the model in `models.py`:
   ```python
   class Student(Timestamp):
       enrollment_number = models.CharField(max_length=50, unique=True)
       new_field = models.CharField(max_length=100)  # Add this
   ```

2. Create a migration:
   ```bash
   python manage.py makemigrations apps.students
   ```

3. Review the migration file created in `migrations/`

4. Apply the migration:
   ```bash
   python manage.py migrate
   ```

## Adding a New Model

1. Create the model in `models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Register in `admin.py` if needed

## Modifying an Existing Field

1. Edit the field definition
2. Create migration: `python manage.py makemigrations`
3. If renaming: manually edit the migration file
4. Apply: `python manage.py migrate`

## Deleting a Model or Field

1. Remove from `models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply: `python manage.py migrate`


# Common Migration Tasks

## Reverting a Migration

```bash
# Revert to a specific migration
python manage.py migrate apps.students 0001

# Revert all
python manage.py migrate apps.students zero
```

## Viewing Migration Status

```bash
python manage.py showmigrations
```

## Creating Empty Migration

```bash
python manage.py makemigrations --empty apps.students --name custom_migration
```

## Squashing Migrations

For many small migrations:

```bash
python manage.py squashmigrations apps.students 0001 0010
```


# Backing Up Database

## SQLite Backup

```bash
cp db.sqlite3 db.sqlite3.backup
```

## PostgreSQL Backup

```bash
pg_dump database_name > backup.sql
```

## PostgreSQL Restore

```bash
psql database_name < backup.sql
```


# Production Deployment

```bash
# On production server
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```
