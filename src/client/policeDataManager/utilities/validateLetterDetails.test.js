import validateLetterDetails from "./validateLetterDetails";

describe("validate letter details test", () => {
  let props;

  beforeEach(() => {
    props = {
      caseDetails: {
        complainantCivilians: [],
        complainantOfficers: []
      },
      letterOfficers: [],
      classifications: {},
      openMissingComplainantDialog: jest.fn(),
      openIncompleteClassificationsDialog: jest.fn(),
      openIncompleteOfficerHistoryDialog: jest.fn()
    };
  });

  test("should return true when all letter details are valid", () => {
    props.caseDetails.complainantCivilians = [{fullName: "Sabrina Dog Hater"}];
    props.letterOfficers = [
      {
        fullName: "White Bat",
        officerHistoryOptionId: 1
      }
    ];
    props.classifications = { "csfn-1": true };
    expect(validateLetterDetails(props)).toBeTrue();
  });

  test("should return false when no complainant is added", () => {
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openMissingComplainantDialog).toHaveBeenCalled();
  });

  test("should return false when no letter officers are selected", () => {
    props.caseDetails.complainantCivilians = [{fullName: "Sabrina Dog Hater"}];
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openIncompleteOfficerHistoryDialog).toHaveBeenCalled();
  });

  test("should return false when no letter officers are undefined", () => {
    props.caseDetails.complainantCivilians = [{fullName: "Sabrina Dog Hater"}];
    props.letterOfficers = undefined;
    expect(validateLetterDetails(props)).toBeFalse();
    expect(props.openIncompleteOfficerHistoryDialog).toHaveBeenCalled();
  });

  test("should return false when no letter officer history is selected", () => {
    props.caseDetails.complainantCivilians = [{fullName: "Sabrina Dog Hater"}];
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
    props.caseDetails.complainantCivilians = [{fullName: "Sabrina Dog Hater"}];
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
