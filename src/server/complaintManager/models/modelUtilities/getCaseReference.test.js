import { getCaseReference } from "./getCaseReference";
import {
  EMPLOYEE_TYPE,
  PERSON_TYPE
} from "../../../../sharedUtilities/constants";
import models from "../index";

describe("getCaseReference", () => {
  const year = "2019";
  const caseNumber = "0001";
  let isAnonymous = false;

  test("should return CC prefix based on civilian person type, caseNumber and year", () => {
    const personType = PERSON_TYPE.CIVILIAN;
    const result = getCaseReference(isAnonymous, personType, caseNumber, year);
    expect(result).toEqual("CC2019-0001");
  });
  test("should return PO prefix based on known officer person type, caseNumber and year", () => {
    const personType = PERSON_TYPE.KNOWN_OFFICER;
    const result = getCaseReference(isAnonymous, personType, caseNumber, year);
    expect(result).toEqual("PO2019-0001");
  });
  test("should return PO prefix based on unknown officer person type, year, case number", () => {
    const personType = PERSON_TYPE.KNOWN_OFFICER;
    const result = getCaseReference(isAnonymous, personType, caseNumber, year);
    expect(result).toEqual("PO2019-0001");
  });

  test("should return CN prefix based on civilian within nopd personType, caseNumber and year", () => {
    const personType = PERSON_TYPE.CIVILIAN_WITHIN_NOPD;
    const result = getCaseReference(isAnonymous, personType, caseNumber, year);
    expect(result).toEqual("CN2019-0001");
  });

  test("should return CC prefix given default person type", () => {
    const personType = PERSON_TYPE.CIVILIAN;
    const result = getCaseReference(isAnonymous, personType, caseNumber, year);
    expect(result).toEqual("CC2019-0001");
  });

  test("should return AC prefix given anonymized primary complainant", () => {
    isAnonymous = true;
    const personType = PERSON_TYPE.CIVILIAN;
    const result = getCaseReference(isAnonymous, personType, caseNumber, year);
    expect(result).toEqual("AC2019-0001");
  });
});
