import { getComplainantType } from "./queryHelperFunctions";

describe("queryHelperFunctions", () => {
  describe("getComplainantType", () => {
    test("should return Civilian (CC) based on civilian/default person type case reference", () => {
      const caseReference = "CC2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Civilian (CC)");
    });

    test("should return Police Officer (PO) prefix based on known/unknown officer person type case reference", () => {
      const caseReference = "PO2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Police Officer (PO)");
    });

    test("should return CN prefix based on civilian within nopd personType case reference", () => {
      const caseReference = "CN2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Civilian Within NOPD (CN)");
    });

    test("should return AC prefix given anonymized primary complainant case reference", () => {
      const caseReference = "AC2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Anonymous (AC)");
    });
  });
});
