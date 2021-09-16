const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const getCaseReference = (caseReferencePrefix, caseNumber, year) => {
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${caseReferencePrefix}${year}-${paddedCaseId}`;
};

const getPrefix = personType => {
  const typeObject = Object.values(PERSON_TYPE).find(
    type => type.description === personType
  );
  return typeObject
    ? typeObject.abbreviation
    : PERSON_TYPE.CIVILIAN.abbreviation;
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
