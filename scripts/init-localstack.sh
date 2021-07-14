#!/bin/bash

BUCKETS=(noipm-local noipm-referral-letters-local noipm-complainant-letters-local noipm-exports-local nopd-officers-local noipm-seed-files noipm-exports-local)
SEED_BUCKET_NAME=noipm-seed-files
SEED_FILE_DIRECTORY="/app/src/instance-files/localstack-seed-files"
FILES=($(ls $SEED_FILE_DIRECTORY))

if [ "$USE_CLOUD_SERVICES" = "true" ]; then
    echo "Cloud services are enabled. Skipping Localstack setup."
    exit 0
fi

echo "Cloud services are disabled. Overriding AWS Credentials..."
# Setup Localstack Credentials
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

echo "Waiting for Localstack to become available..."
./wait-for-it.sh localstack:4566

# Make the buckets
for BUCKET in "${BUCKETS[@]}"; do
    aws --endpoint-url=http://host.docker.internal:4566 s3 mb "s3://$BUCKET" --region=us-east-1
done

# Seed the buckets
for FILE in "${FILES[@]}"; do
    aws --endpoint-url=http://host.docker.internal:4566 s3 cp "$SEED_FILE_DIRECTORY/$FILE" "s3://$SEED_BUCKET_NAME"
done

# Officer Seed Data exception because REASONS
aws --endpoint-url=http://host.docker.internal:4566 s3 cp "$SEED_FILE_DIRECTORY/officerSeedData.csv" "s3://nopd-officers-local"

