import {
  EMPLOYEE_TYPE,
  PERSON_TYPE
} from "../../../../sharedUtilities/constants";

export const getCaseReference = (isAnonymous, personType, caseNumber, year) => {
  let prefix;
  if (isAnonymous) {
    prefix = "AC";
  } else {
    prefix = getPrefix(personType);
  }

  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${prefix}${year}-${paddedCaseId}`;
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
    case PERSON_TYPE.CIVILIAN_WITHIN_NOPD:
      return "CN";
      break;
    default:
      return "CC";
  }
};
