#!/usr/bin/env bash

circleci build --job test

docker-compose build e2e
docker-compose run e2e