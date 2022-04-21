#!/bin/bash

BUCKETS=(noipm-local noipm-referral-letters-local noipm-complainant-letters-local noipm-exports-local nopd-officers-local noipm-seed-files)
SEED_BUCKET_NAME=noipm-seed-files
OFFICER_DATA_BUCKET=nopd-officers-local
BASE_BUCKET_NAME=noipm-local
SEED_FILE_SRC_DIR="/app/src/instance-files/localstack-seed-files"
SIGNATURE_FILE_SRC_DIR="${REACT_APP_INSTANCE_FILES_DIR}/images"
FILES=($(ls $SEED_FILE_SRC_DIR))
SIGNATURE_FILES=($(ls $SIGNATURE_FILE_SRC_DIR | grep .png | grep -v header_text))

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

# Make the buckets if they don't exist (and copy any seeded files into them)
for BUCKET in "${BUCKETS[@]}"; do
    # if the bucket doesn't exist
    if aws --endpoint-url=http://host.docker.internal:4566 s3 ls "s3://$BUCKET" 2>&1 | grep -q 'NoSuchBucket'
    then
        # create the bucket
        aws --endpoint-url=http://host.docker.internal:4566 s3 mb "s3://$BUCKET" --region=us-east-1

        # run any file copy jobs for the bucket which was created
        case $BUCKET in
            
            $SEED_BUCKET_NAME)
                # Place DB seeder files into the noipm-seed-files bucket
                for FILE in "${FILES[@]}"; do
                    aws --endpoint-url=http://host.docker.internal:4566 s3 cp "$SEED_FILE_SRC_DIR/$FILE" "s3://$SEED_BUCKET_NAME"
                done
                ;;

            $BASE_BUCKET_NAME)
                # Place signatures into the noipm-local bucket
                for FILE in "${SIGNATURE_FILES[@]}"; do
                    aws --endpoint-url=http://host.docker.internal:4566 s3 cp "$SIGNATURE_FILE_SRC_DIR/$FILE" "s3://$BASE_BUCKET_NAME/signatures/$FILE"
                done
                ;;

            $OFFICER_DATA_BUCKET)
                # Place officer seed data in nopd-officers-local (from config) bucket
                aws --endpoint-url=http://host.docker.internal:4566 s3 cp "$SEED_FILE_SRC_DIR/officerSeedData.csv" "s3://$OFFICER_DATA_BUCKET"
                ;;
            *)
                echo "No files to be copied for $BUCKET bucket"
                ;;
        esac
    else
        echo Skip creating $BUCKET bucket since it already exists
    fi
done





