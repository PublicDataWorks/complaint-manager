import {
  getCaseReference,
  getCaseReferencePrefix
} from "./caseReferenceHelpersFunctions";

const {
  PERSON_TYPE,
  DEFAULT_PERSON_TYPE
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

    Object.values(PERSON_TYPE).forEach(type => {
      test(`should return appropriate prefix based on ${type.description} person type`, () => {
        const personType = type.description;
        const result = getCaseReferencePrefix(isAnonymous, personType);
        expect(result).toEqual(type.abbreviation);
      });
    });

    test("should return appropriate prefix given default person type", () => {
      const result = getCaseReferencePrefix(
        isAnonymous,
        "Not a Real Person Type"
      );
      expect(result).toEqual(DEFAULT_PERSON_TYPE.abbreviation);
    });

    test("should return AC prefix given anonymized primary complainant", () => {
      isAnonymous = true;
      const personType = DEFAULT_PERSON_TYPE.description;
      const result = getCaseReferencePrefix(isAnonymous, personType);
      expect(result).toEqual("AC");
    });
  });
});
