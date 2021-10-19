#!/bin/bash
INSTANCE_IMAGE=publicdataworks/instance-files-noipm
INSTANCE_VERSION=latest
E2E_IMAGE=publicdataworks/e2e-noipm:latest

while getopts i:v:e: flag
do
    case "${flag}" in
        i) INSTANCE_IMAGE=${OPTARG};;
        v) INSTANCE_VERSION=${OPTARG};;
        e) E2E_IMAGE=${OPTARG};;
    esac
done

CONTAINER_ID=$(docker-compose ps -q app)

if [[ -n $CONTAINER_ID ]];
then
  RESTART_APP_CHECK=$(docker inspect --format "{{.State.Running}}" $CONTAINER_ID)
  echo "Stopping app container..."
  docker-compose stop app
fi

echo "Deleting all existing failed e2e images older than 90 minutes..."
source scripts/remove_e2e_images.sh

# In case you want to test a single test case
# nightwatch --config /instance-files/tests/e2e/nightwatch.conf.js --env local --test /e2e/tests/policeDataManager/policeDataManagerUserJourney.js --testcase "should navigate to all exports page and export all cases"

echo "Running E2E test suite for Police Data Manager..."
INSTANCE_IMAGE=${INSTANCE_IMAGE} INSTANCE_VERSION=${INSTANCE_VERSION} E2E_IMAGE=${E2E_IMAGE} docker-compose run --rm e2e nightwatch --config /src/instance-files/tests/e2e/nightwatch.conf.js --env local --env /app/src/instance-files /e2e/tests/policeDataManager

echo "Stopping app-e2e container..."
docker-compose stop app-e2e

if [[ $RESTART_APP_CHECK = true ]];
then
  echo "Restarting app container..."
  docker-compose start app
fi
