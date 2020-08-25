#!/bin/bash

CONTAINER_ID=$(docker-compose ps -q app)
if [[ -n $CONTAINER_ID ]];
then
  RESTART_APP_CHECK=$(docker inspect --format "{{.State.Running}}" $CONTAINER_ID)
fi

echo "Stopping app container..."
docker-compose stop app

# In case you want to test a single test case
# nightwatch --env local --test tests/complaintManager/complaintManagerUserJourney.js --testcase "should navigate to all exports page and export all cases"

echo "Running E2E test suite for Complaint Manager..."
docker-compose run e2e nightwatch --env local tests/complaintManager

echo "Stopping app-e2e container..."
docker-compose stop app-e2e

if [[ $RESTART_APP_CHECK = true ]];
then
  echo "Restarting app container..."
  docker-compose start app
fi
