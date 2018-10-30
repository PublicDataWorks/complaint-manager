import {
  formatAddress,
  isPresent,
  renderHtml,
  showOfficerHistory,
  showOfficerHistoryHeader,
  sumAllegations
} from "./handlebarHelpers";

describe("handlebarHelpers", function() {
  describe("formatAddress", function() {
    test("there is no address", () => {
      const address = undefined;
      const formattedAddress = formatAddress(address);
      expect(formattedAddress).toEqual("");
    });

    test("address has street address", () => {
      const address = {
        streetAddress: "101 N Main St",
        city: "Chicago",
        state: "IL",
        zipCode: "11111",
        intersection: ""
      };
      const formattedAddress = formatAddress(address);
      const expectedAddress = "101 N Main St, Chicago, IL 11111";
      expect(formattedAddress).toEqual(expectedAddress);
    });

    test("address has an intersection", () => {
      const address = {
        streetAddress: "",
        city: "Chicago",
        state: "IL",
        zipCode: "11111",
        intersection: "1st and 2nd St"
      };
      const formattedAddress = formatAddress(address);
      const expectedAddress = "1st and 2nd St, Chicago, IL 11111";
      expect(formattedAddress).toEqual(expectedAddress);
    });

    test("address missing state", () => {
      const address = {
        streetAddress: "101 N Main St",
        city: "Chicago",
        state: "",
        zipCode: "11111",
        intersection: "1st and 2nd St"
      };
      const formattedAddress = formatAddress(address);
      const expectedAddress = "101 N Main St, 1st and 2nd St, Chicago 11111";
      expect(formattedAddress).toEqual(expectedAddress);
    });
  });

  describe("isPresent", function() {
    test("value is present", () => {
      const value = "a value";
      const evaluatedValue = isPresent(value);
      expect(evaluatedValue).toBeTruthy();
    });

    test("value is undefined", () => {
      const evaluatedValue = isPresent(undefined);
      expect(evaluatedValue).toBeFalsy();
    });

    test("value is null", () => {
      const evaluatedValue = isPresent(null);
      expect(evaluatedValue).toBeFalsy();
    });

    test("value is empty string", () => {
      const evaluatedValue = isPresent("");
      expect(evaluatedValue).toBeFalsy();
    });

    test("value is paragraph and br tags", () => {
      const value = "<p><br></p>";
      const evaluatedValue = isPresent(value);
      expect(evaluatedValue).toBeFalsy();
    });
  });

  describe("renderHtml", function() {
    test("empty string is passed", () => {
      const html = "";
      const renderedHtml = renderHtml(html);
      expect(renderedHtml).toEqual(html);
    });

    test("null is passed", () => {
      const html = null;
      const renderedHtml = renderHtml(html);
      expect(renderedHtml).toEqual("");
    });

    test("undefined is passed", () => {
      const html = undefined;
      const renderedHtml = renderHtml(html);
      expect(renderedHtml).toEqual("");
    });

    test("html is passed", () => {
      const html = "<p><strong>hello</strong></p>";
      const renderedHtml = renderHtml(html);
      expect(renderedHtml.string).toEqual(html);
    });
  });

  describe("sumAllegations", function() {
    test("letterOfficer has no allegations", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: undefined,
        numHistoricalMedAllegations: undefined,
        numHistoricalLowAllegations: undefined
      };
      const numAllegations = sumAllegations(letterOfficer);
      expect(numAllegations).toEqual(0);
    });

    test("letterOfficer has all three types", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: 1,
        numHistoricalMedAllegations: 2,
        numHistoricalLowAllegations: 3
      };
      const numAllegations = sumAllegations(letterOfficer);
      expect(numAllegations).toEqual(6);
    });

    test("letterOfficer has all med allegations", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: undefined,
        numHistoricalMedAllegations: 2,
        numHistoricalLowAllegations: undefined
      };
      const numAllegations = sumAllegations(letterOfficer);
      expect(numAllegations).toEqual(2);
    });
  });

  describe("showOfficerHistory", function() {
    test("there are no historical allegations, historical behavior notes, or officer history notes", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: undefined,
        numHistoricalMedAllegations: undefined,
        numHistoricalLowAllegations: undefined,
        historicalBehaviorNotes: "",
        referralLetterOfficerHistoryNotes: []
      };
      const showHistory = showOfficerHistory(letterOfficer);
      expect(showHistory).toBeFalsy();
    });

    test("there are only allegations", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: 1,
        numHistoricalMedAllegations: undefined,
        numHistoricalLowAllegations: undefined,
        historicalBehaviorNotes: "",
        referralLetterOfficerHistoryNotes: []
      };
      const showHistory = showOfficerHistory(letterOfficer);
      expect(showHistory).toBeTruthy();
    });

    test("there are only behavior notes", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: undefined,
        numHistoricalMedAllegations: undefined,
        numHistoricalLowAllegations: undefined,
        historicalBehaviorNotes: "a note",
        referralLetterOfficerHistoryNotes: []
      };
      const showHistory = showOfficerHistory(letterOfficer);
      expect(showHistory).toBeTruthy();
    });

    test("there are notes officer history notes", () => {
      const letterOfficer = {
        numHistoricalHighAllegations: undefined,
        numHistoricalMedAllegations: undefined,
        numHistoricalLowAllegations: undefined,
        historicalBehaviorNotes: "",
        referralLetterOfficerHistoryNotes: [{ a: "note" }]
      };
      const showHistory = showOfficerHistory(letterOfficer);
      expect(showHistory).toBeTruthy();
    });
  });

  describe("showOfficerHistoryHeader", function() {
    test("no officers have any officer history", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            numHistoricalHighAllegations: undefined,
            numHistoricalMedAllegations: undefined,
            numHistoricalLowAllegations: undefined,
            historicalBehaviorNotes: "",
            referralLetterOfficerHistoryNotes: []
          }
        },
        {
          letterOfficer: {
            numHistoricalHighAllegations: undefined,
            numHistoricalMedAllegations: undefined,
            numHistoricalLowAllegations: undefined,
            historicalBehaviorNotes: "",
            referralLetterOfficerHistoryNotes: []
          }
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeFalsy();
    });

    test("one officer has some history", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            numHistoricalHighAllegations: 1,
            numHistoricalMedAllegations: undefined,
            numHistoricalLowAllegations: undefined,
            historicalBehaviorNotes: "",
            referralLetterOfficerHistoryNotes: []
          }
        },
        {
          letterOfficer: {
            numHistoricalHighAllegations: undefined,
            numHistoricalMedAllegations: undefined,
            numHistoricalLowAllegations: undefined,
            historicalBehaviorNotes: "",
            referralLetterOfficerHistoryNotes: []
          }
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeTruthy();
    });

    test("all officers have some history", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            numHistoricalHighAllegations: 1,
            numHistoricalMedAllegations: undefined,
            numHistoricalLowAllegations: undefined,
            historicalBehaviorNotes: "",
            referralLetterOfficerHistoryNotes: []
          }
        },
        {
          letterOfficer: {
            numHistoricalHighAllegations: 1,
            numHistoricalMedAllegations: 2,
            numHistoricalLowAllegations: 3,
            historicalBehaviorNotes: "notes",
            referralLetterOfficerHistoryNotes: [{ a: "note" }]
          }
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeTruthy();
    });
  });
});
