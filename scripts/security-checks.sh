#!/usr/bin/env sh

set +e

ALPINE_VERSION=3.4
ISSUES_REPORT_FILE=hawkeye_report.json
TO_EXCLUDE="^src/(server/config/(.)*|server/(server.test.js|(models|handlers/users)/(.)*.test.js))$"

function create_container_with_code() {
    if [  "$(docker ps -a | grep "target-code")" ]
    then
         echo "Copying local filesystem to target-code container...."
         docker cp . target-code:/target
    else
        echo "Bundling target-code in a container...."
        docker create -v /target --name target-code alpine:${ALPINE_VERSION} /bin/true;
        docker cp . target-code:/target;
    fi
}

function run_hawkeye_on_container_code() {
    docker rm -f /hawkeye
    docker run --volumes-from target-code --name hawkeye --entrypoint /bin/bash stono/hawkeye:latest -c "hawkeye scan -t /target --exclude \"$TO_EXCLUDE\" --json $ISSUES_REPORT_FILE && npm install -g npm-check-updates && ncu -e 2 --packageFile /target/package.json -x winston"
    hawkeye_return=$?
}

function create_artifacts_folder() {
  mkdir -p /tmp/artifacts/;
}

function copy_report_from_docker_remote_to_artifacts() {
  docker cp hawkeye:/target/${ISSUES_REPORT_FILE} /tmp/artifacts/${ISSUES_REPORT_FILE}
}

create_container_with_code
run_hawkeye_on_container_code
create_artifacts_folder
copy_report_from_docker_remote_to_artifacts

if [ ${hawkeye_return} == 0 ]
then
    echo "Security checks passed"
else
    echo "Security checks failed. Report is available on artifacts tab."
fi

exit ${hawkeye_return}
