const {
  PERSON_TYPE,
  DEFAULT_PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const getPersonType = primaryComplainant => {
  if (
    primaryComplainant &&
    primaryComplainant.officerId &&
    PERSON_TYPE.KNOWN_OFFICER
  ) {
    switch (primaryComplainant.caseEmployeeType) {
      case PERSON_TYPE.KNOWN_OFFICER.employeeDescription:
        return PERSON_TYPE.KNOWN_OFFICER.description;
      case PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription:
        return PERSON_TYPE.CIVILIAN_WITHIN_PD.description;
    }
  } else if (
    primaryComplainant &&
    primaryComplainant.isUnknownOfficer &&
    PERSON_TYPE.UNKNOWN_OFFICER
  ) {
    return PERSON_TYPE.UNKNOWN_OFFICER.description;
  } else if (
    primaryComplainant &&
    primaryComplainant.inmateId &&
    PERSON_TYPE.PERSON_IN_CUSTODY
  ) {
    return PERSON_TYPE.PERSON_IN_CUSTODY.description;
  } else if (
    primaryComplainant &&
    primaryComplainant.personType &&
    PERSON_TYPE[primaryComplainant.personType]
  ) {
    return PERSON_TYPE[primaryComplainant.personType].description;
  } else {
    return DEFAULT_PERSON_TYPE.description;
  }
};
