import officerHistoryOptionsReducer from "./officerHistoryOptionsReducer";
import { ALLEGATION_OPTIONS } from "../../../sharedUtilities/constants";
import { getOfficerHistoryOptionsRadioButtonValuesSuccess } from "../../actionCreators/officerHistoryOptionsActionCreator";

describe("officerHistoryOptionReducer", function() {
  test("should initialize to blank array", () => {
    const newState = officerHistoryOptionsReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual([]);
  });

  test("should set given officer history options on state", () => {
    const newOfficerHistoryOptions = [
      [0, ALLEGATION_OPTIONS.NO_NOTEWORTHY_HISTORY],
      [1, ALLEGATION_OPTIONS.RECRUIT]
    ];

    const newState = officerHistoryOptionsReducer(
      undefined,
      getOfficerHistoryOptionsRadioButtonValuesSuccess(newOfficerHistoryOptions)
    );

    expect(newState).toEqual(newOfficerHistoryOptions);
  });
});
