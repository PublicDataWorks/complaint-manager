const CASE_STATUS_MAP = require("../../../../sharedUtilities/constants")
  .CASE_STATUS_MAP;
const CASE_STATUS = require("../../../../sharedUtilities/constants").CASE_STATUS;
const _ = require("lodash");

const determineNextCaseStatus = currentStatus => {
  if (!currentStatus) {
    return CASE_STATUS.INITIAL;
  }

  if (currentStatus === CASE_STATUS.CLOSED) {
    return null;
  }

  const currentStatusIndex = CASE_STATUS_MAP[currentStatus];
  return _.invert(CASE_STATUS_MAP)[currentStatusIndex + 1];
};

module.exports = determineNextCaseStatus;
