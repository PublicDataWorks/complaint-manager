import { PERSON_TYPE } from "../instance-files/constants";

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
  middleInitial,
  lastName,
  suffix,
  personType
) => {
  if (personType === PERSON_TYPE.CIVILIAN) {
    return getCivilianFullName(
      firstName,
      middleInitial ? middleInitial.substr(0, 1).toUpperCase() : null,
      lastName,
      suffix
    );
  } else {
    return getOfficerFullName(
      firstName,
      middleInitial,
      lastName,
      personType === PERSON_TYPE.UNKNOWN_OFFICER
    );
  }
};

export const getOfficerFullName = (
  firstName,
  middleInitial,
  lastName,
  isUnknownOfficer
) => {
  if (isUnknownOfficer) {
    return "Unknown Officer";
  } else {
    const editedFirstName = firstName ? firstName : "";
    const editedMiddleInitial = middleInitial ? middleInitial : "";
    const editedLastName = lastName ? lastName : "";

    return `${editedFirstName} ${editedMiddleInitial} ${editedLastName}`.replace(
      "  ",
      " "
    );
  }
};
