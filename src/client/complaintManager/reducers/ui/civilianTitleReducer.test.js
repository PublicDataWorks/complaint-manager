import { getCivilianTitlesSuccess } from "../../actionCreators/civilianTitleActionCreators";
import civilianTitleReducer from "./civilianTitleReducer";

describe("civilianTitleReducer", () => {
  test("should initialize to blank array", () => {
    const newState = civilianTitleReducer(undefined, {
      type: "RANDOM"
    });
    expect(newState).toEqual([]);
  });

  test("should set given civilianTitles in state", () => {
    const civilianTitles = [["N/A", 5], ["Mr.", 2], ["Mz.", 7]];

    const newState = civilianTitleReducer(
      undefined,
      getCivilianTitlesSuccess(civilianTitles)
    );

    expect(newState).toEqual(civilianTitles);
  });
});
