#!/usr/bin/env bash
set -e

ENV=$1

BUILD_URL=$(curl -u ${CIRCLE_API_USER_TOKEN}: -d "build_parameters[CIRCLE_JOB]=update-search-indices-${ENV}" https://circleci.com/api/v1.1/project/gh/PublicDataWorks/police_data_manager/tree/master | jq -r '.build_url')

echo "Build started, check progress here: ${BUILD_URL}"

