#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PosgreSQL started"

    echo "Creating the database tables..."
    python manage.py create_db
    echo "Tables created"
    echo "Seeding table..."
    python manage.py seed_db
    echo "Table seeded"
fi

if [ "$FLASK_ENV" = "development" ]
then
    echo "Creating the database tables..."
    python manage.py create_db
    echo "Tables created"
    echo "Seeding table..."
    python manage.py seed_db
    echo "Table seeded"
fi

exec "$@"