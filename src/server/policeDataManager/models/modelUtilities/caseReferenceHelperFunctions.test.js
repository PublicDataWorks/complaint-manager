import {
  getCaseReference,
  getCaseReferencePrefix
} from "./caseReferenceHelpersFunctions";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("case reference helper functions", () => {
  test("getCaseReference should format case prefix, year, and case number", () => {
    const year = "2019";
    const caseNumber = "0001";
    const caseReferencePrefix = "CC";
    const result = getCaseReference(caseReferencePrefix, caseNumber, year);
    expect(result).toEqual("CC2019-0001");
  });

  describe("getCaseReferencePrefix", () => {
    let isAnonymous = false;

    test("should return CC prefix based on civilian person type", () => {
      const personType = PERSON_TYPE.CIVILIAN.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("CC");
    });
    test("should return PO prefix based on known officer person type", () => {
      const personType = PERSON_TYPE.KNOWN_OFFICER.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("PO");
    });
    test("should return PO prefix based on unknown officer person type", () => {
      const personType = PERSON_TYPE.KNOWN_OFFICER.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("PO");
    });

    test("should return CN prefix based on civilian within pd person type", () => {
      const personType = PERSON_TYPE.CIVILIAN_WITHIN_PD.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("CN");
    });

    test("should return CC prefix given default person type", () => {
      const personType = PERSON_TYPE.CIVILIAN.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("CC");
    });

    test("should return AC prefix given anonymized primary complainant", () => {
      isAnonymous = true;
      const personType = PERSON_TYPE.CIVILIAN.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("AC");
    });
  });
});
