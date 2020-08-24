#!/bin/bash

echo "Stopping app container..."
docker-compose stop app
CONTAINER_ID=$(docker-compose ps -q app)

# In case you want to test a single test case
# nightwatch --env local --test tests/complaintManager/complaintManagerUserJourney.js --testcase "should navigate to all exports page and export all cases"

echo "Running E2E test suite for Complaint Manager..."
docker-compose run e2e nightwatch --env local tests/complaintManager

echo "Stopping app-e2e container..."
docker-compose stop app-e2e

if [[ -n $CONTAINER_ID ]]
then
  RESTART_APP_CHECK=$(docker inspect --format "{{.State.ExitCode}}" $CONTAINER_ID)
  if [[ 1 -eq $RESTART_APP_CHECK ]];
  then
    echo "Restarting app container..."
    docker-compose start app
  fi
fi
