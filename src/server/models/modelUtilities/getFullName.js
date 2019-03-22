import { PERSON_TYPE } from "../../../sharedUtilities/constants";

export const getCivilianFullName = (
  givenFirst,
  givenMiddleInitial,
  givenLast,
  givenSuffix
) => {
  let firstName = givenFirst;
  let middleInitial = givenMiddleInitial;
  let lastName = givenLast;
  let suffix = givenSuffix;
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
  if (personType === PERSON_TYPE.CIVILIAN) {
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
      personType === PERSON_TYPE.UNKNOWN_OFFICER
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
    const editedFirstName = firstName ? firstName : "";
    const editedMiddleName = middleName ? middleName : "";
    const editedLastName = lastName ? lastName : "";

    return `${editedFirstName} ${editedMiddleName} ${editedLastName}`.replace(
      "  ",
      " "
    );
  }
};
