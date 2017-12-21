#!/usr/bin/env sh

#Parameters
URL=$1

apk --no-cache add curl

for i in `seq 1 10`; do
    curl -f $URL
    if [ 0 -eq $? ]; then
        echo "App is up!"
        exit 0
    fi
    echo App is unresponsive, waiting 1 second and trying again..
    sleep 1
done
echo App never came up
exit 1
