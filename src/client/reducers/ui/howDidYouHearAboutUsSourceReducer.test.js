import howDidYouHearAboutUsSourceReducer from "./howDidYouHearAboutUsSourceReducer";
import { getHowDidYouHearAboutUsSourcesSuccess } from "../../actionCreators/howDidYouHearAboutUsSourceActionCreators";

describe("howDidYouHearAboutUsSourceReducer", () => {
  test("should initialize to blank array", () => {
    const newState = howDidYouHearAboutUsSourceReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual([]);
  });

  test("should set given howDidYouHearAboutUsSources on state", () => {
    const newHowDidYouHearAboutUsSources = [["Facebook", 0], ["Friend", 1]];

    const newState = howDidYouHearAboutUsSourceReducer(
      undefined,
      getHowDidYouHearAboutUsSourcesSuccess(newHowDidYouHearAboutUsSources)
    );

    expect(newState).toEqual(newHowDidYouHearAboutUsSources);
  });
});
