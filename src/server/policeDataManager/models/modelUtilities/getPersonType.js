import {
  EMPLOYEE_TYPE,
  PERSON_TYPE
} from "../../../../instance-files/constants";

export const getPersonType = primaryComplainant => {
  if (primaryComplainant && primaryComplainant.officerId) {
    switch (primaryComplainant.caseEmployeeType) {
      case EMPLOYEE_TYPE.OFFICER:
        return PERSON_TYPE.KNOWN_OFFICER;
      case EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD:
        return PERSON_TYPE.CIVILIAN_WITHIN_PD;
    }
  } else if (primaryComplainant && primaryComplainant.isUnknownOfficer) {
    return PERSON_TYPE.UNKNOWN_OFFICER;
  } else {
    return PERSON_TYPE.CIVILIAN;
  }
};
