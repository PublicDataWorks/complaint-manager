#!/usr/bin/env bash
ISSUES_REPORT_FILE=hawkeye_report.json

#function run_hawkeye_modules() {
#  mkdir -p /tmp/artifacts/;
#}
#
#run_hawkeye_modules

hawkeye scan --show-code -t /target --json $ISSUES_REPORT_FILE -m node-yarnoutdated -f high;
yarn_outdated_return=$?;
hawkeye scan --show-code -t /target --json $ISSUES_REPORT_FILE -m "files-contents" -m "node-crossenv" -m "node-yarnaudit" -f low | grep -v -P --line-buffered '^\[info\] (?!Checking|Running|Scan complete)';
yarn_audit_return=${PIPESTATUS[0]};

if [[ ${yarn_outdated_return} -ne 0  || ${yarn_audit_return} -ne 0 ]]
then
    exit 1
else
    exit 0
fi