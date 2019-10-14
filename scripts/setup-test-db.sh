#!/usr/bin/env bash
DB_ENV=$1

echo Running against $DB_ENV database...

yarn run sequelize db:create --env=$DB_ENV

DB_CREATED=$?
if [ $DB_CREATED -eq 0 ]; then
  NODE_ENV=$DB_ENV node scripts/loadSchema.js
fi

NODE_ENV=$DB_ENV yarn run sequelize db:migrate --env=$DB_ENV

exit $?