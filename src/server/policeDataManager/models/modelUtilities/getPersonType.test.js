import models from "../index";
import { getPersonType } from "./getPersonType";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("getPersonType", () => {
  test("should return Civilian based on civilian primaryComplainant", () => {
    const primaryComplainant = {
      fullName: "Pleading Eyes"
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.CIVILIAN.description);
  });

  test("should return Civilian when no primaryComplainant is defined", () => {
    const primaryComplainant = undefined;
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.CIVILIAN.description);
  });

  test("should return Unknown Officer based on anonymous officer primaryComplainant", () => {
    const primaryComplainant = {
      isUnknownOfficer: true
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.UNKNOWN_OFFICER.description);
  });

  test("should return Known Officer based on officer primaryComplainant", () => {
    const primaryComplainant = {
      officerId: "123ABC",
      caseEmployeeType: PERSON_TYPE.KNOWN_OFFICER.employeeDescription,
      isUnknownOfficer: false
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.KNOWN_OFFICER.description);
  });

  test("should return Civilian (PD) based on civilian within pd primaryComplainant", () => {
    const primaryComplainant = {
      officerId: "123ABC",
      caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription,
      isUnknownOfficer: false
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.CIVILIAN_WITHIN_PD.description);
  });
});
