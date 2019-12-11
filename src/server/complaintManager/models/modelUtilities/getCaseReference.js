import {
  EMPLOYEE_TYPE,
  PERSON_TYPE
} from "../../../../sharedUtilities/constants";

export const getCaseReference = (personType, caseNumber, year) => {
  let prefix;
  switch (personType) {
    case PERSON_TYPE.CIVILIAN:
      prefix = "CC";
      break;
    case PERSON_TYPE.KNOWN_OFFICER:
    case PERSON_TYPE.UNKNOWN_OFFICER:
      prefix = "PO";
      break;
    case PERSON_TYPE.CIVILIAN_WITHIN_NOPD:
      prefix = "CN";
      break;
    default:
      prefix = "CC";
  }

  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${prefix}${year}-${paddedCaseId}`;
};
