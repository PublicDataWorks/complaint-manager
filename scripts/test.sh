#!/usr/bin/env bash

circleci build --job test

docker-compose build
docker-compose up &
circleci build --job e2e-testing -e ENVIRONMENT=local
docker-compose down