const getActiveStep = (caseStatusMap, caseStatus) => {
  if (caseStatusMap[caseStatus] === caseStatusMap["Closed"]) {
    return caseStatusMap["Closed"] + 1; // marks closed status with a checkmark
  }
  return caseStatusMap[caseStatus];
};

export default getActiveStep;
