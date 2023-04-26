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
