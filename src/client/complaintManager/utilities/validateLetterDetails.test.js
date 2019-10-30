import validateLetterDetails from "./validateLetterDetails";
import {
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog
} from "../actionCreators/letterActionCreators";

describe("validate letter details test", () => {
  let props, incompleteClassificationsSpy, incompleteOfficerHistorySpy;

  beforeEach(() => {
    props = {
      letterOfficers: [],
      classifications: {},
      classificationFeature: true,
      openIncompleteClassificationsDialog: jest.fn(),
      openIncompleteOfficerHistoryDialog: jest.fn()
    };
  });

  test("should return true when all letter details are valid", () => {
    props.letterOfficers = [
      {
        fullName: "White Bat",
        officerHistoryOptionId: 1
      }
    ];
    props.classifications = { "csfn-1": true };
    expect(validateLetterDetails(props)).toBeTrue();
  });

  test("should return false when no letter officers are selected", () => {
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openIncompleteOfficerHistoryDialog).toHaveBeenCalled();
  });

  test("should return false when no letter officers are undefined", () => {
    props.letterOfficers = undefined;
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openIncompleteOfficerHistoryDialog).toHaveBeenCalled();
  });

  test("should return false when no letter officer history is selected", () => {
    props.letterOfficers = [
      {
        fullName: "White Bat",
        officerHistoryOptionId: null
      }
    ];
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openIncompleteOfficerHistoryDialog).toHaveBeenCalled();
  });

  test("should return false when no classifications are selected", () => {
    props.letterOfficers = [
      {
        fullName: "White Bat",
        officerHistoryOptionId: 1
      }
    ];
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openIncompleteClassificationsDialog).toHaveBeenCalled();
  });
});
