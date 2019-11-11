#!/bin/bash

set -e

echo "Stopping app container..."
docker-compose stop app

echo "Running E2E test suite for Matrix Manager..."
docker-compose run e2e nightwatch --env local tests/matrixManager

echo "Stopping app-e2e container..."
docker-compose stop app-e2e
