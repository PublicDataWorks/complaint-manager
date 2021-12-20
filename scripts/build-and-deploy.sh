#!/bin/bash

set -e

# Refer to input documentation in template-deploy.config

source $1

if [[ -z "${INSTANCE_FILES_VERSION}" ]]; then
    INSTANCE_FILES_VERSION=latest
fi

if [[ -z "${INSTANCE_FILES_DIR}" ]]; then
    echo "Skipping instance files build and defaulting to $INSTANCE_FILES_IMAGE:$INSTANCE_FILES_VERSION"
else
    echo "Step: Build Versioned Instance Files locally (if based on locally cloned codebase)"
    docker build -f $INSTANCE_FILES_DIR/Dockerfile -t $INSTANCE_FILES_IMAGE:$INSTANCE_FILES_VERSION $INSTANCE_FILES_DIR
fi

echo "Step: Build Versioned App Images locally (Web and Worker)"
docker build -f Dockerfile.base --build-arg REACT_APP_ENV=$ENV_NAME --build-arg REACT_APP_GOOGLE_API_KEY=$GOOGLE_MAPS_API_KEY --build-arg INSTANCE_IMAGE=$INSTANCE_FILES_IMAGE --build-arg INSTANCE_VERSION=$INSTANCE_FILES_VERSION -t publicdataworks/base-app:latest .
docker build -f Dockerfile.web -t registry.heroku.com/$HEROKU_APP_NAME/web .
docker build -f Dockerfile.worker -t registry.heroku.com/$HEROKU_APP_NAME/worker .

echo "Step: Migrate and Seed Database"
docker run -e NODE_ENV=$ENV_NAME -e DATABASE_USERNAME=$DATABASE_USERNAME -e DATABASE_PASS=$DATABASE_PASS -e DATABASE_NAME=$DATABASE_NAME -e DATABASE_HOST=$DATABASE_HOST -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e REACT_APP_INSTANCE_FILES_DIR=/app/src/instance-files registry.heroku.com/$HEROKU_APP_NAME/web:latest yarn setup:db

echo "Step: Deploy Web and Worker containers to Heroku"
docker push registry.heroku.com/$HEROKU_APP_NAME/web
docker push registry.heroku.com/$HEROKU_APP_NAME/worker
heroku container:release -a $HEROKU_APP_NAME web worker

echo "Step: Ensure Deploy Succeeded in Cloud env"
BASEDIR=$(dirname "$0")
docker run --rm -v $(pwd)/$BASEDIR:/app alpine:latest /app/ensure-deploy-succeeded.sh "https://$HEROKU_APP_NAME.herokuapp.com/health-check"

echo 'Deployment Successful!'
echo "If you would like to preserve the docker images that got built and deployed you can use the command docker tag registry.heroku.com/$HEROKU_APP_NAME/web <organization>/<image>:<version> and docker tag registry.heroku.com/$HEROKU_APP_NAME/worker <organization>/<image>:<version>"
echo "Additionally, if you would like to preserve the code as it was built for this version, you may create a git tag on your forked repo. git tag <name>. And then run git push --tags to push up the tag."