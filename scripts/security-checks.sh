#!/usr/bin/env sh

set +e

bash ./scripts/hawkeye-container-script.sh
hawkeye_return=$?;

if [[ ${hawkeye_return} == 0 ]]
then
  echo -e "\033[0;32mSecurity checks passed\033[0m"
elif [[ ${hawkeye_return} == 2 ]]
then
  echo -e "\033[0;93mThere are package updates available, consider upgrading.\033[0m"
  exit 0
else
  echo -e "\033[0;31mSecurity checks failed. Report is available in the root directory in hawkeye_report.json.\033[0m"
fi

exit ${hawkeye_return}
