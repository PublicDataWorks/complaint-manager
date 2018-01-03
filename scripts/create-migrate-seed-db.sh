#!/usr/bin/env sh

for i in `seq 1 10`; do
    echo attempting to create db
    yarn db:create
    if [ 0 -eq $? ]; then
        echo DB is up, migrating and seeding
        yarn db:migrate
        yarn db:seed
        exit 0
    fi
    echo DB is unresponsive, waiting 1 second and trying again..
    sleep 1
done
echo DB never came up
exit 1
