import {
  getCivilianFullName,
  getOfficerFullName,
  getPersonFullName
} from "./getFullName";

describe("getFullName", () => {
  describe("getPersonFullName", () => {
    test("should get full name for known officer", () => {
      const firstName = "First";
      const middleName = "M";
      const lastName = "Last";
      const suffix = null;
      const personType = "Known Officer";

      expect(
        getPersonFullName(firstName, middleName, lastName, suffix, personType)
      ).toEqual("First M Last");
    });

    test("should get unknown officer for unknown officer", () => {
      const personType = "Unknown Officer";

      expect(getPersonFullName(null, null, null, null, personType)).toEqual(
        "Unknown Officer"
      );
    });
  });

  describe("getOfficerFullName", () => {
    test("gets officer full name with all fields", () => {
      const first = "Gideon";
      const middle = "B";
      const last = "Abshire";
      const isUnknownOfficer = false;

      expect(getOfficerFullName(first, middle, last, isUnknownOfficer)).toEqual(
        "Gideon B Abshire"
      );
    });

    test("gets unknown officer for unknown officer", () => {
      const first = null;
      const middle = null;
      const last = null;
      const isUnknownOfficer = true;

      expect(getOfficerFullName(first, middle, last, isUnknownOfficer)).toEqual(
        "Unknown Officer"
      );
    });
  });

  describe("getCivilianFullName", () => {
    test("gets civilian full name with all fields", () => {
      const first = "First";
      const middle = "B";
      const last = "Last";
      const suffix = "Suf";

      expect(getCivilianFullName(first, middle, last, suffix)).toEqual(
        "First B. Last Suf"
      );
    });

    test("does not add period if middle initial is missing", () => {
      const first = "First";
      const middle = null;
      const last = "Last";
      const suffix = "Suf";

      expect(getCivilianFullName(first, middle, last, suffix)).toEqual(
        "First Last Suf"
      );
    });

    test("excludes missing names", () => {
      const first = null;
      const middle = "T";
      const last = "Last";
      const suffix = null;

      expect(getCivilianFullName(first, middle, last, suffix)).toEqual(
        "T. Last"
      );
    });
  });
});
