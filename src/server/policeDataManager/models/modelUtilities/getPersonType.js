const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const getPersonType = primaryComplainant => {
  if (primaryComplainant && primaryComplainant.officerId) {
    switch (primaryComplainant.caseEmployeeType) {
      case PERSON_TYPE.KNOWN_OFFICER.employeeDescription:
        return PERSON_TYPE.KNOWN_OFFICER.description;
      case PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription:
        return PERSON_TYPE.CIVILIAN_WITHIN_PD.description;
    }
  } else if (primaryComplainant && primaryComplainant.isUnknownOfficer) {
    return PERSON_TYPE.UNKNOWN_OFFICER.description;
  } else {
    return PERSON_TYPE.CIVILIAN.description;
  }
};
