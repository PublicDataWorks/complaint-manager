import { CIVILIAN_INITIATED } from "../../../sharedUtilities/constants";

export const getCaseReference = (complaintType, caseNumber, year) => {
  const prefix = complaintType === CIVILIAN_INITIATED ? "CC" : "PO";
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${prefix}${year}-${paddedCaseId}`;
};
