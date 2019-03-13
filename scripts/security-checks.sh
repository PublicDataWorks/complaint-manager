#!/usr/bin/env sh

set +e

ISSUES_REPORT_FILE=hawkeye_report.json
# We tried upgrading to react-pdf 4.0.0, but it violates unsafe-eval CSP.
# This issue tracks it: https://github.com/mozilla/pdf.js/issues/10229. It's closed but has not made it into a release yet.

function run_hawkeye_on_container_code() {
  docker rm -f /hawkeye
  docker run -v $(pwd):/target --name hawkeye --entrypoint /bin/bash hawkeyesec/scanner-cli:latest -c "./scripts/hawkeye-container-script.sh";
  hawkeye_return=$?;
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

if [[ ${hawkeye_return} == 0 ]]
then
  echo "\033[0;32mSecurity checks passed\033[0m"
else
  echo "\033[0;31mSecurity checks failed. Report is available in the directory /tmp/artifacts/.\033[0m"
fi

exit ${hawkeye_return}
