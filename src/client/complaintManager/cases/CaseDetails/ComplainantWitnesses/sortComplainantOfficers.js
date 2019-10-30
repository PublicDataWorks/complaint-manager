export const getLastName = civilianOrOfficer => {
  if (isKnownOfficer(civilianOrOfficer)) {
    return civilianOrOfficer.lastName.toLowerCase();
  }

  if (civilianOrOfficer.hasOwnProperty("lastName")) {
    return civilianOrOfficer.lastName.toLowerCase();
  }
  return "";
};

export const getFirstName = civilianOrOfficer => {
  if (isKnownOfficer(civilianOrOfficer)) {
    return civilianOrOfficer.firstName.toLowerCase();
  }
  if (civilianOrOfficer.hasOwnProperty("firstName")) {
    return civilianOrOfficer.firstName.toLowerCase();
  }
  return "";
};
