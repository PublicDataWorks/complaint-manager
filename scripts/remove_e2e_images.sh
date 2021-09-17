#!/bin/bash

#removes all e2e user journey failed images older than 90 minutes
E2E_IMAGE_PATH="./e2e/tests/policeDataManager/policeDataManagerUserJourney"
FILES=$(find $E2E_IMAGE_PATH -mmin +90 -type f -name "*.png")

if [ -n "$FILES" ]; then
    echo "Removing the following images:"
    find $E2E_IMAGE_PATH -mmin +90 -type f -name "*.png" -exec ls {} +
    find $E2E_IMAGE_PATH -mmin +90 -type f -name "*.png" -delete
else
    echo "There are no images to be removed."
fi
