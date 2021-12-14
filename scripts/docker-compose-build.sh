#!/bin/bash
set -e

# Build script to build app and keep yarn.lock up to date
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

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
cd ..

echo "Building base..."
docker build -f Dockerfile.base --build-arg INSTANCE_IMAGE=${INSTANCE_IMAGE} --build-arg INSTANCE_VERSION=${INSTANCE_VERSION} --build-arg E2E_IMAGE=${E2E_IMAGE} -t publicdataworks/base-app:latest .

echo "Building..."
INSTANCE_IMAGE=${INSTANCE_IMAGE} INSTANCE_VERSION=${INSTANCE_VERSION} E2E_IMAGE=${E2E_IMAGE} docker-compose build

echo "Copying updated yarn.lock from container"
docker run --rm --entrypoint cat police_data_manager_app:latest /app/yarn.lock > yarn.lock

echo "Build complete"