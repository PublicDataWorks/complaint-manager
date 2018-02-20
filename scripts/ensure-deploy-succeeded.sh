#!/usr/bin/env sh

#Parameters
URL=$1

sudo apt-get update && sudo apt-get install curl

for i in `seq 1 10`; do
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
