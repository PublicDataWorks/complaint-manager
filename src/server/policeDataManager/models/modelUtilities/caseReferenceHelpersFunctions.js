const {
  PERSON_TYPE,
  DEFAULT_PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const getCaseReference = (caseReferencePrefix, caseNumber, year) => {
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${caseReferencePrefix}${year}-${paddedCaseId}`;
};

const getPrefix = personType => {
  const typeKey = Object.keys(PERSON_TYPE).find(
    key =>
      PERSON_TYPE[key].description === personType ||
      PERSON_TYPE[key].employeeDescription === personType ||
      key === personType
  );
  return PERSON_TYPE[typeKey]
    ? PERSON_TYPE[typeKey].abbreviation
    : DEFAULT_PERSON_TYPE.abbreviation;
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
