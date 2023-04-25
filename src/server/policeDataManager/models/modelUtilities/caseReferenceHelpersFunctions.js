const {
  PERSON_TYPE,
  DEFAULT_PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

// FIXME remove after updating the sortable cases view
const oldGetPrefix = personType => {
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

// FIXME remove after updating the sortable cases view
export const oldGetCaseReferencePrefix = (isAnonymous, personType) => {
  let prefix;
  if (isAnonymous) {
    prefix = "AC";
  } else {
    prefix = oldGetPrefix(personType);
  }
  return prefix;
};

export const getCaseReference = (caseReferencePrefix, caseNumber, year) => {
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${caseReferencePrefix}${year}-${paddedCaseId}`;
};

const getPrefix = (personType, defaultPersonType) => {
  return personType?.abbreviation ?? defaultPersonType?.abbreviation ?? "";
};

export const getCaseReferencePrefix = (
  isAnonymous,
  personType,
  defaultPersonType
) => {
  let prefix;
  if (isAnonymous) {
    prefix = "AC";
  } else {
    prefix = getPrefix(personType, defaultPersonType);
  }
  return prefix;
};
