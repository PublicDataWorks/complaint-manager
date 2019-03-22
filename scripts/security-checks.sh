#!/usr/bin/env sh

set +e

bash ./scripts/hawkeye-container-script.sh
hawkeye_return=$?;

if [[ ${hawkeye_return} == 0 ]]
then
  echo "\033[0;32mSecurity checks passed\033[0m"
else
  echo "\033[0;31mSecurity checks failed. Report is available in the root directory in hawkeye_report.json.\033[0m"
fi

exit ${hawkeye_return}
