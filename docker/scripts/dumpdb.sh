#!/bin/bash

MYSQL_CONTAINER="some-mysql"  

DB_NAME="prestashop"

DB_USER="root"
DB_PASS="admin"

# Lokalny katalog, do którego zapiszesz plik eksportu
LOCAL_BACKUP_DIR="../db_init"

# Sprawdź, czy katalog istnieje, jeśli nie, utwórz go
mkdir -p $LOCAL_BACKUP_DIR

# Nazwa pliku backupu (możesz dodać datę w nazwie, aby była unikalna)
BACKUP_FILE="${LOCAL_BACKUP_DIR}/dump2.sql"

# Eksport bazy danych z kontenera do lokalnego pliku
docker exec $MYSQL_CONTAINER mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

# Informacja o zakończeniu procesu
echo "Backup bazy danych $DB_NAME został zapisany do $BACKUP_FILE"
