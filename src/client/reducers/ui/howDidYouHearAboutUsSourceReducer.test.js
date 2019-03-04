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
    const newHowDidYouHearAboutUsSources = [[0, "Facebook"], [1, "Friend"]];

    const newState = howDidYouHearAboutUsSourceReducer(
      undefined,
      getHowDidYouHearAboutUsSourcesSuccess(newHowDidYouHearAboutUsSources)
    );

    expect(newState).toEqual(newHowDidYouHearAboutUsSources);
  });
});
