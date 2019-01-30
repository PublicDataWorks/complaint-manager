#!/usr/bin/env sh

set +e

ISSUES_REPORT_FILE=hawkeye_report.json
TO_EXCLUDE="^src/(server/config/(.)*|server/(server.test.js|(models|handlers/users)/(.)*.test.js))$"
LIBRARIES_TO_BE_UPGRADED="winston,csv-parse,react-pdf,csv-stringify,jest,jest-each"
# We tried upgrading to react-pdf 4.0.0, but it violates unsafe-eval CSP.
# This issue tracks it: https://github.com/mozilla/pdf.js/issues/10229. It's closed but has not made it into a release yet.

function run_hawkeye_on_container_code() {
  docker rm -f /hawkeye
  docker run -v $(pwd):/target --name hawkeye --entrypoint /bin/bash stono/hawkeye:latest -c "hawkeye scan -t /target --exclude \"$TO_EXCLUDE\" --json $ISSUES_REPORT_FILE && npm install -g npm-check-updates && ncu -e 2 --packageFile /target/package.json -x \"$LIBRARIES_TO_BE_UPGRADED\""
  hawkeye_return=$?
}

function create_artifacts_folder() {
  mkdir -p /tmp/artifacts/;
}

function copy_report_from_docker_remote_to_artifacts() {
  docker cp hawkeye:/target/${ISSUES_REPORT_FILE} /tmp/artifacts/${ISSUES_REPORT_FILE}
}

function remove_hawkeye_report() {
  rm hawkeye_report.json
}

run_hawkeye_on_container_code
create_artifacts_folder
copy_report_from_docker_remote_to_artifacts
remove_hawkeye_report

if [ ${hawkeye_return} == 0 ]
then
  echo "Security checks passed"
else
  echo "Security checks failed. Report is available on artifacts tab."
fi

exit ${hawkeye_return}
