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
  if (personType?.includes("Officer")) {
    return getOfficerFullName(
      firstName,
      middleName,
      lastName,
      personType.includes("Unknown")
    );
  } else {
    return getCivilianFullName(
      firstName,
      middleName ? middleName.substr(0, 1).toUpperCase() : null,
      lastName,
      suffix
    );
  }
};

export const getOfficerFullName = (
  firstName,
  middleName,
  lastName,
  isUnknownOfficer
) => {
  if (firstName === "Anonymous") {
    return "Anonymous";
  } else if (isUnknownOfficer) {
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
