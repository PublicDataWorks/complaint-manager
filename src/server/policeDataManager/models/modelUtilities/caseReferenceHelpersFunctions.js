import { getPersonType } from "./getPersonType";
import { PERSON_TYPE } from "../../../../instance-files/constants";

export const getCaseReference = (caseReferencePrefix, caseNumber, year) => {
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${caseReferencePrefix}${year}-${paddedCaseId}`;
};

const getPrefix = personType => {
  const typeObject = Object.values(PERSON_TYPE).find(
    type => type.description === personType
  );
  return typeObject ? typeObject.abbreviation : "CC";
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
