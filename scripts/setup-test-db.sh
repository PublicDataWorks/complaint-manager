#!/usr/bin/env bash
DB_ENV=$1

echo Runing against $DB_ENV database...

yarn run sequelize db:create --env=$DB_ENV

NODE_ENV=$DB_ENV yarn run sequelize db:migrate --env=$DB_ENV

exit $?