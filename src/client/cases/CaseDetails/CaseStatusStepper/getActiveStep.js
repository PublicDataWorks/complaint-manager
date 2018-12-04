import {
  CASE_STATUS,
  CASE_STATUS_MAP
} from "../../../../sharedUtilities/constants";

const getActiveStep = (caseStatusMap, caseStatus) => {
  if (caseStatusMap[caseStatus] === caseStatusMap[CASE_STATUS.CLOSED]) {
    return caseStatusMap[CASE_STATUS.CLOSED] + 1; // marks closed status with a checkmark
  }
  return caseStatusMap[caseStatus];
};

export default getActiveStep;
