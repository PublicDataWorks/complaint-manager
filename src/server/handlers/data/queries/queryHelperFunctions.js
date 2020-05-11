import { CASE_STATUS } from "../../../../sharedUtilities/constants";

export const updateCaseStatus = async (caseToUpdate, status) => {
  const caseStatusList = [
    CASE_STATUS.ACTIVE,
    CASE_STATUS.LETTER_IN_PROGRESS,
    CASE_STATUS.READY_FOR_REVIEW,
    CASE_STATUS.FORWARDED_TO_AGENCY,
    CASE_STATUS.CLOSED
  ];

  for (const caseStatus in caseStatusList) {
    await caseToUpdate.update(
      { status: caseStatusList[caseStatus] },
      { auditUser: "someone" }
    );
    if (caseStatusList[caseStatus] === status) {
      return;
    }
  }
  caseToUpdate.reload();
};
