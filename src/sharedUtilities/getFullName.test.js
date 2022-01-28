import {
  getCivilianFullName,
  getOfficerFullName,
  getPersonFullName
} from "./getFullName";


const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("getFullName", () => {
  describe("getPersonFullName", () => {
    test("should get full name for known officer", () => {
      const firstName = "First";
      const middleName = "M";
      const lastName = "Last";
      const suffix = null;
      const personType = PERSON_TYPE.KNOWN_OFFICER.description;

      expect(
        getPersonFullName(firstName, middleName, lastName, suffix, personType)
      ).toEqual("First M Last");
    });

    test("should escape HTML tags and discard HTML attributes in full name for known officer", () => {
      const firstName = "<h1>First</h1>";
      const middleName = `<a href="www.google.com">M</a>`;
      const lastName = "<strong>Last</strong>";
      const suffix = null;
      const personType = PERSON_TYPE.KNOWN_OFFICER.description;

      expect(
        getPersonFullName(firstName, middleName, lastName, suffix, personType)
      ).toEqual("&lt;h1&gt;First&lt;/h1&gt; &lt;a&gt;M&lt;/a&gt; &lt;strong&gt;Last&lt;/strong&gt;");
    });

    test("should get unknown officer for unknown officer", () => {
      const personType = PERSON_TYPE.UNKNOWN_OFFICER.description;

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

    test("should escape HTML tags and discard HTML attributes when getting full name for officer", () => {
      const firstName = "<h1>Gideon</h1>";
      const middleName = `<a href="www.google.com">B</a>`;
      const lastName = "<strong>Abshire</strong>";
      const suffix = null;
      const personType = PERSON_TYPE.KNOWN_OFFICER.description;

      expect(
        getOfficerFullName(firstName, middleName, lastName, suffix, personType)
      ).toEqual("&lt;h1&gt;Gideon&lt;/h1&gt; &lt;a&gt;B&lt;/a&gt; &lt;strong&gt;Abshire&lt;/strong&gt;");
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

    test("should escape HTML tags and discard HTML attributes when getting full name for civilian", () => {
      const firstName = "<h1>First</h1>";
      const middleName = `<a href="www.google.com">B</a>`;
      const lastName = "<strong>Last</strong>";
      const suffix = `<script src="doStuff.js">Suf</script>`;
      const personType = PERSON_TYPE.KNOWN_OFFICER.description;

      expect(
        getCivilianFullName(firstName, middleName, lastName, suffix, personType)
      ).toEqual("&lt;h1&gt;First&lt;/h1&gt; &lt;a&gt;B&lt;/a&gt;. &lt;strong&gt;Last&lt;/strong&gt; &lt;script&gt;Suf&lt;/script&gt;");
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
