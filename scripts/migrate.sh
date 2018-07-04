#!/bin/sh

HEROKU_APP_NAME=$1
SQL_DIR=${2:-sql}

usage()
{
  echo "Usage: $0 heroku-app-name [sql-directory]";
  exit 1;
} 

if [ $# -eq 0 ]; then
  usage
fi

if [ ! -d "$SQL_DIR" ]; then
  echo "SQL directory not found: $SQL_DIR";
  usage
fi

heroku login
heroku pg:reset --confirm $HEROKU_APP_NAME
for SQL_SCRIPT in $SQL_DIR/*; do heroku pg:psql < $SQL_SCRIPT; done