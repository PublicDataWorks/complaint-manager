import models from "../index";
import { getPersonType } from "./getPersonType";
import {
  EMPLOYEE_TYPE,
  PERSON_TYPE
} from "../../../../sharedUtilities/constants";

describe("getPersonType", () => {
  test("should return Civilian based on civilian primaryComplainant", () => {
    const primaryComplainant = {
      fullName: "Pleading Eyes"
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.CIVILIAN);
  });

  test("should return Civilian when no primaryComplainant is defined", () => {
    const primaryComplainant = undefined;
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.CIVILIAN);
  });

  test("should return Unknown Officer based on anonymous officer primaryComplainant", () => {
    const primaryComplainant = {
      isUnknownOfficer: true
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.UNKNOWN_OFFICER);
  });

  test("should return Known Officer based on officer primaryComplainant", () => {
    const primaryComplainant = {
      officerId: "123ABC",
      caseEmployeeType: EMPLOYEE_TYPE.OFFICER,
      isUnknownOfficer: false
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.KNOWN_OFFICER);
  });

  test("should return Civilian (NOPD) based on civilian within nopd primaryComplainant", () => {
    const primaryComplainant = {
      officerId: "123ABC",
      caseEmployeeType: EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD,
      isUnknownOfficer: false
    };
    const result = getPersonType(primaryComplainant);
    expect(result).toEqual(PERSON_TYPE.CIVILIAN_WITHIN_PD);
  });
});
