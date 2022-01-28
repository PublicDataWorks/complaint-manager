import { sanitize } from "./sanitizeHTML";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const getCivilianFullName = (
  givenFirst,
  givenMiddleInitial,
  givenLast,
  givenSuffix
) => {
  let firstName = sanitize(givenFirst);
  let middleInitial = sanitize(givenMiddleInitial);
  let lastName = sanitize(givenLast);
  let suffix = sanitize(givenSuffix);
  middleInitial = middleInitial ? middleInitial + "." : "";

  const allNames = [firstName, middleInitial, lastName, suffix];

  const existingNames = allNames.filter(name => Boolean(name));

  return existingNames.reduce((accumulator, currentName, currentIndex) => {
    if (currentName) {
      accumulator += currentName;
    }

    if (currentIndex !== existingNames.length - 1) {
      accumulator += " ";
    }

    return accumulator;
  }, "");
};

export const getPersonFullName = (
  firstName,
  middleName,
  lastName,
  suffix,
  personType
) => {
  if (personType === PERSON_TYPE.CIVILIAN.description) {
    return getCivilianFullName(
      firstName,
      middleName ? middleName.substr(0, 1).toUpperCase() : null,
      lastName,
      suffix
    );
  } else {
    return getOfficerFullName(
      firstName,
      middleName,
      lastName,
      personType === PERSON_TYPE.UNKNOWN_OFFICER.description
    );
  }
};

export const getOfficerFullName = (
  firstName,
  middleName,
  lastName,
  isUnknownOfficer
) => {
  if (isUnknownOfficer) {
    return "Unknown Officer";
  } else {
    const editedFirstName = firstName ? sanitize(firstName) : "";
    const editedMiddleName = middleName ? sanitize(middleName) : "";
    const editedLastName = lastName ? sanitize(lastName) : "";

    return `${editedFirstName} ${editedMiddleName} ${editedLastName}`.replace(
      "  ",
      " "
    );
  }
};
