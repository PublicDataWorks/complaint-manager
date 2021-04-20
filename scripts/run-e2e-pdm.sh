#!/bin/bash

CONTAINER_ID=$(docker-compose ps -q app)

if [[ -n $CONTAINER_ID ]];
then
  RESTART_APP_CHECK=$(docker inspect --format "{{.State.Running}}" $CONTAINER_ID)
  echo "Stopping app container..."
  docker-compose stop app
fi

# In case you want to test a single test case
# nightwatch --config /instance-files/tests/e2e/nightwatch.conf.js --env local --test /e2e/tests/policeDataManager/policeDataManagerUserJourney.js --testcase "should navigate to all exports page and export all cases"

echo "Running E2E test suite for Police Data Manager..."
docker-compose run --rm e2e nightwatch --config /app/src/instance-files/tests/e2e/nightwatch.conf.js --env local /e2e/tests/policeDataManager

echo "Stopping app-e2e container..."
docker-compose stop app-e2e

if [[ $RESTART_APP_CHECK = true ]];
then
  echo "Restarting app container..."
  docker-compose start app
fi
