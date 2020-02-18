#!/usr/bin/env bash

ISSUES_REPORT_FILE=hawkeye_report.json

hawkeye scan --show-code -t $(pwd) --json $ISSUES_REPORT_FILE -m node-yarnoutdated -f medium;
yarn_outdated_return=$?;
hawkeye scan --show-code -t $(pwd) --json $ISSUES_REPORT_FILE -m "files-contents" -m "node-yarnaudit" -f low | grep -v '^\[info\] (?!Checking|Running|Scan complete)';
yarn_audit_return=${PIPESTATUS[0]};

if [[ ${yarn_audit_return} -ne 0 ]]
then
    exit 1
elif [[ ${yarn_outdated_return} -ne 0 ]]
then
    exit 2
else
    exit 0
fi