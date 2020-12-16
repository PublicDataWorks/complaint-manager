#!/bin/bash

BUCKETS=(noipm-local noipm-referral-letters-local noipm-complainant-letters-local noipm-exports-local nopd-officers-local noipm-seed-files noipm-exports-local)
SEED_BUCKET_NAME=noipm-seed-files
SEED_FILE_DIRECTORY="./localstack-seed-files"
FILES=($(ls $SEED_FILE_DIRECTORY))

if [[ -z "${CLOUD_SERVICES_DISABLED}" ]]; then
    echo "Cloud services are enabled. Skipping Localstack setup."
    exit 0
fi

# Setup Localstack Credentials
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip &> /dev/null
    ./aws/install
fi    

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

