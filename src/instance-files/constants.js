export const INSTANCE_CIVILIAN_WITHIN_PD_TITLE = "Civilian (NOPD)";
export const INSTANCE_CIVILIAN_WITHIN_PD_INITIATED =
  "Civilian Within NOPD Initiated";
export const INSTANCE_EMPLOYEE_TYPE_CIVILIAN_WITHIN_PD = "Civilian Within NOPD";
export const INSTANCE_PERSON_TYPE_CIVILIAN_WITHIN_PD = "Civilian (NOPD)";

export const generateSubjectLine = (caseReference, pibCaseNumber) => {
  if (pibCaseNumber) {
    return `Supplemental Referral; OIPM Complaint ${caseReference}; PIB Case ${pibCaseNumber}`;
  }
  return `Complaint Referral; OIPM Complaint ${caseReference}`;
};
