import {
  formatAddress,
  generateSignature,
  isPresent,
  newLineToLineBreak,
  renderHtml,
  showOfficerHistoryHeader,
  showRecommendedActions,
  sumAllegations,
  addNumbers,
  isGreaterThan,
  atLeastOneInputDefined,
  isEqual,
  isCivilianComplainant
} from "./handlebarHelpers";
import { generateSubjectLine } from "../instance-files/helpers";
import { ORGANIZATION } from "../instance-files/constants";
import { SENDER_NAME, SENDER_SIGNATURE } from "../instance-files/referralLetterDefaults";

describe("handlebarHelpers", function () {
  describe("formatAddress", function () {
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

    test("address has additional location info", () => {
      const address = {
        streetAddress: "101 N Main St",
        city: "Chicago",
        state: "",
        zipCode: "11111",
        intersection: "1st and 2nd St",
        additionalLocationInfo: "outside my car"
      };

      const formattedAddress = formatAddress(address);
      const expectedAddress =
        "101 N Main St, 1st and 2nd St, Chicago 11111 (outside my car)";
      expect(formattedAddress).toEqual(expectedAddress);
    });
  });

  describe("isPresent", function () {
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

  describe("isCivilianComplainant", () => {
    test("complainantPersonType is a civilian", () => {
      const complainantPersonType = "Civilian";
      const evaluatedPersonType = isCivilianComplainant(complainantPersonType);
      expect(evaluatedPersonType).toBeTrue();
    });

    test("complainantPersonType is not a civilian", () => {
      const complainantPersonType = "Unknown Officer";
      const evaluatedPersonType = isCivilianComplainant(complainantPersonType);
      expect(evaluatedPersonType).toBeFalse();
    });
  });

  describe("renderHtml", function () {
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

  describe("sumAllegations", function () {
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

  describe("showOfficerHistoryHeader", function () {
    test("no officers have history option id", () => {
      const accusedOfficers = [
        {
          letterOfficer: {}
        },
        {
          letterOfficer: {}
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeFalsy();
    });

    test("one officer has history option id", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            officerHistoryOptionId: 4,
            numHistoricalHighAllegations: 1
          }
        },
        {
          letterOfficer: {}
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeTruthy();
    });

    test("all officers have history option id", () => {
      const accusedOfficers = [
        {
          letterOfficer: {
            numHistoricalHighAllegations: 1,
            officerHistoryOptionId: 4
          }
        },
        {
          letterOfficer: {
            numHistoricalHighAllegations: 1,
            numHistoricalMedAllegations: 2,
            numHistoricalLowAllegations: 3,
            historicalBehaviorNotes: "notes",
            referralLetterOfficerHistoryNotes: [{ a: "note" }],
            officerHistoryOptionId: 4
          }
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeTruthy();
    });

    test("Unknown officer shows header", () => {
      const accusedOfficers = [
        {
          fullName: "Unknown Officer",
          letterOfficer: {
            officerHistoryOptionId: null
          }
        }
      ];

      const showHeader = showOfficerHistoryHeader(accusedOfficers);
      expect(showHeader).toBeTruthy();
    });
  });

  describe("showRecommendedActions", function () {
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

  describe("newLineToLineBreak", function () {
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

  describe("generateSignature", function () {
    const blankLine = "<p><br></p>";
    const sender = `${SENDER_NAME}\nDPM`;

    test("returns an blank line without signature when includeSignature is false", () => {
      expect(generateSignature(sender, false)).toEqual(blankLine);
    });

    test("returns an blank line without signature when no signature for given name", () => {
      expect(generateSignature("someone not sender", true)).toEqual(blankLine);
    });

    test("returns official signature when they are the sender", () => {
      const signature = generateSignature(sender, true);

      expect(signature).toEqual(
        `<img style="max-height: 55px" src=file:/app/src/instance-files/images/${SENDER_SIGNATURE} />`
      );
    });
  });
});

describe("generate subject line", function () {
  const caseReference = "CC2019-0027";
  const pibCaseNumber = "2019-0027-R";
  const supplementalSubjectLine =
    `Supplemental Referral; ${ORGANIZATION} Complaint CC2019-0027; PIB Case 2019-0027-R`;
  const subjectLineWithoutPibCaseNumber =
    `Complaint Referral; ${ORGANIZATION} Complaint CC2019-0027`;

  test("returns supplemental subject line whe pib case number present", () => {
    expect(generateSubjectLine(caseReference, pibCaseNumber)).toEqual(
      supplementalSubjectLine
    );
  });
  test("returns subject line without pib case number when pib case number null", () => {
    expect(generateSubjectLine(caseReference, null)).toEqual(
      subjectLineWithoutPibCaseNumber
    );
  });
});

describe("index functions", function () {
  test("returns index + 1", () => {
    expect(addNumbers(1, 1)).toEqual(2);
  });
  test("returns true when index is greater than 1", () => {
    expect(isGreaterThan(2, 1)).toBeTruthy();
  });
  test("returns false when index is 1", () => {
    expect(isGreaterThan(1, 1)).toBeFalsy();
  });
});

describe("check if arrays are empty", function () {
  test("returns true when at least one input is not empty", () => {
    expect(atLeastOneInputDefined(null, [1])).toBeTruthy();
  });

  test("returns false when everything is not defined", () => {
    expect(atLeastOneInputDefined(null, [])).toBeFalsy();
  });

  test("returns false when one input is undefined and one is null", () => {
    expect(atLeastOneInputDefined(undefined, null)).toBeFalsy();
  });
});

describe("officer history helpers", function () {
  test("returns true when inputs are equal to 1", () => {
    expect(isEqual(1, 1)).toBeTruthy();
  });

  test("returns false when integer and string are same value", () => {
    expect(isEqual("1", 1)).toBeFalsy();
  });
});
