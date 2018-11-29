import {
  extractFirstLine,
  formatAddress,
  generateSignature,
  getImagePath,
  isPresent,
  newLineToLineBreak,
  renderHtml,
  showOfficerHistory,
  showOfficerHistoryHeader,
  showRecommendedActions,
  sumAllegations
} from "./handlebarHelpers";
import { CASE_STATUS, SIGNATURE_URLS } from "../sharedUtilities/constants";

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

  describe("showRecommendedActions", function() {
    test("should not show recommended actions section if no actions and notes are empty", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            recommendedActionNotes: "",
            referralLetterOfficerRecommendedActions: []
          }
        },
        {
          letterOfficer: {
            recommendedActionNotes: "",
            referralLetterOfficerRecommendedActions: []
          }
        }
      ];

      const showRecActions = showRecommendedActions(accusedOfficers);
      expect(showRecActions).toEqual(false);
    });

    test("should not show recommended actions section if no actions and notes are null or undefined", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            recommendedActionNotes: null,
            referralLetterOfficerRecommendedActions: []
          }
        },
        {
          letterOfficer: {
            recommendedActionNotes: undefined,
            referralLetterOfficerRecommendedActions: []
          }
        }
      ];

      const showRecActions = showRecommendedActions(accusedOfficers);
      expect(showRecActions).toEqual(false);
    });

    test("should show recommended actions section if there are actions", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            recommendedActionNotes: "",
            referralLetterOfficerRecommendedActions: [1]
          }
        },
        {
          letterOfficer: {
            recommendedActionNotes: "",
            referralLetterOfficerRecommendedActions: []
          }
        }
      ];

      const showRecActions = showRecommendedActions(accusedOfficers);
      expect(showRecActions).toEqual(true);
    });

    test("should show recommended actions section if there are notes", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            recommendedActionNotes: "",
            referralLetterOfficerRecommendedActions: []
          }
        },
        {
          letterOfficer: {
            recommendedActionNotes: "a note",
            referralLetterOfficerRecommendedActions: []
          }
        }
      ];

      const showRecActions = showRecommendedActions(accusedOfficers);
      expect(showRecActions).toEqual(true);
    });
  });

  describe("newLineToLineBreak", function() {
    test("should return empty string when given null", () => {
      expect(newLineToLineBreak(null)).toEqual("");
    });
    test("should return empty string when given undefined", () => {
      expect(newLineToLineBreak(undefined)).toEqual("");
    });

    test("should replace new line with html break tag", () => {
      const stringWithNewLine = "string\nnew line";

      const expectedHtmlWithBreaks = "string<br>new line";
      const htmlWithBreaks = newLineToLineBreak(stringWithNewLine);

      expect(htmlWithBreaks).toEqual(expectedHtmlWithBreaks);
    });

    test("should return given string if no new line characters", () => {
      const stringWithoutNewLine = "no new lines here!";
      const expectedHtml = "no new lines here!";
      const resultString = newLineToLineBreak(stringWithoutNewLine);
      expect(resultString).toEqual(expectedHtml);
    });
    test("should replace multiple new lines with html break tag", () => {
      const stringWithMultipleNewLines = "many\nnew\nlines\nhere!!";
      const expectedHtml = "many<br>new<br>lines<br>here!!";
      const resultString = newLineToLineBreak(stringWithMultipleNewLines);
      expect(resultString).toEqual(expectedHtml);
    });
  });

  describe("extractFirstLine", function() {
    test("should return an empty string when given an empty string", () => {
      const emptyString = "";
      const expectedResult = "";
      expect(extractFirstLine(emptyString)).toEqual(expectedResult);
    });

    test("should return an empty string when given null", () => {
      expect(extractFirstLine(null)).toEqual("");
    });

    test("should return an empty string when given undefined", () => {
      expect(extractFirstLine(undefined)).toEqual("");
    });

    test("should extract first line of text", () => {
      const stringWithMultipleLines = "first line\nsecond line\nthird line";
      const expectedFirstLine = "first line";
      const extractedFirstLine = extractFirstLine(stringWithMultipleLines);
      expect(extractedFirstLine).toEqual(expectedFirstLine);
    });
  });

  describe("generateSignature", function() {
    const blankLine = "<p><br></p>";
    const signaturePath = `<img style="max-height: 40px" src=${
      SIGNATURE_URLS.STELLA_PATH
    } />`;

    test("should return an empty space when no signature for given name and case status is FORWARDED_TO_AGENCY", () => {
      const emptyString = "";
      expect(
        generateSignature(emptyString, CASE_STATUS.FORWARDED_TO_AGENCY)
      ).toEqual(blankLine);
    });
    test("should return stellas signature when stella is sender and case status is FORWARDED_TO_AGENCY", () => {
      const sender = "Stella Cziment\nDPM";

      expect(
        generateSignature(sender, CASE_STATUS.FORWARDED_TO_AGENCY)
      ).toEqual(signaturePath);
    });
    test("should return stellas signature when stella is sender and case status is CLOSED", () => {
      const sender = "Stella Cziment\nDPM";

      expect(generateSignature(sender, CASE_STATUS.CLOSED)).toEqual(
        signaturePath
      );
    });
    test("should not return signature case status is READY_FOR_REVIEW", () => {
      const sender = "Stella Cziment\nDPM";
      expect(generateSignature(sender, CASE_STATUS.READY_FOR_REVIEW)).toEqual(
        blankLine
      );
    });
    test("should not return signature case status is LETTER_IN_PROGRESS", () => {
      const sender = "Stella Cziment\nDPM";
      expect(generateSignature(sender, CASE_STATUS.LETTER_IN_PROGRESS)).toEqual(
        blankLine
      );
    });
  });
});
