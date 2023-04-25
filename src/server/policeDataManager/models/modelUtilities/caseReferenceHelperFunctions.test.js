import {
  getCaseReference,
  getCaseReferencePrefix
} from "./caseReferenceHelpersFunctions";

describe("case reference helper functions", () => {
  test("getCaseReference should format case prefix, year, and case number", () => {
    const year = "2019";
    const caseNumber = "0001";
    const caseReferencePrefix = "CC";
    const result = getCaseReference(caseReferencePrefix, caseNumber, year);
    expect(result).toEqual("CC2019-0001");
  });

  describe("getCaseReferencePrefix", () => {
    test("should return AC when isAnonymous is true", () => {
      expect(
        getCaseReferencePrefix(
          true,
          { abbreviation: "GG" },
          { abbreviation: "OMG" }
        )
      ).toEqual("AC");
    });

    test("should return the person type's abbreviation if it has one and the case is not anonymous", () => {
      expect(
        getCaseReferencePrefix(
          false,
          { abbreviation: "GG" },
          { abbreviation: "OMG" }
        )
      ).toEqual("GG");
    });

    test("should return the default type's abbreviation if person type has no abbreviation", () => {
      expect(
        getCaseReferencePrefix(false, {}, { abbreviation: "OMG" })
      ).toEqual("OMG");
    });

    test("should return the default type's abbreviation if person type is undefined", () => {
      expect(
        getCaseReferencePrefix(false, undefined, { abbreviation: "OMG" })
      ).toEqual("OMG");
    });
  });
});
