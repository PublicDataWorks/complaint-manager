import {
  EMPLOYEE_TYPE,
  PERSON_TYPE
} from "../../../../sharedUtilities/constants";
import { getPersonType } from "./getPersonType";

export const getCaseReference = (caseReferencePrefix, caseNumber, year) => {
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${caseReferencePrefix}${year}-${paddedCaseId}`;
};

const getPrefix = personType => {
  switch (personType) {
    case PERSON_TYPE.CIVILIAN:
      return "CC";
      break;
    case PERSON_TYPE.KNOWN_OFFICER:
    case PERSON_TYPE.UNKNOWN_OFFICER:
      return "PO";
      break;
    case PERSON_TYPE.CIVILIAN_WITHIN_PD:
      return "CN";
      break;
    default:
      return "CC";
  }
};

export const getCaseReferencePrefix = (isAnonymous, personType) => {
  let prefix;
  if (isAnonymous) {
    prefix = "AC";
  } else {
    prefix = getPrefix(personType);
  }
  return prefix;
};
