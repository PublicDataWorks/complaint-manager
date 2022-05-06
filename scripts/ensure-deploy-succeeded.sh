#!/usr/bin/env sh

set -e

#Parameters
URL=$1

# This script needs to run inside an Alpine container
apk --no-cache add curl

for i in `seq 1 20`; do
    curl -f $URL
    if [ 0 -eq $? ]; then
        echo "App is up!"
        exit 0
    fi
    echo App is unresponsive, waiting 2 seconds and trying again..
    sleep 2
done
echo App never came up
exit 1
