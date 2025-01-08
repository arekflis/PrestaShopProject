#!/bin/bash

DB_HOST=${DB_SERVER:-admin-mysql_db}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-student}
DB_NAME=${DB_NAME:-BE_19348}
DB_PORT=${DB_PORT:-3306}

echo "Waiting for MySQL at $DB_HOST:3306..."
until mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SHOW DATABASES;" > /dev/null 2>&1; do
  sleep 5
  echo "Still waiting for MySQL..."
done

echo "Importing database $DB_NAME"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" $DB_NAME < /var/www/html/dump.sql
echo "Database imported successfully."


echo "Starting PrestaShop..."
apache2-foreground