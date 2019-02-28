import heardAboutSourceReducer from "./heardAboutSourceReducer";
import { getHeardAboutSourcesSuccess } from "../../actionCreators/heardAboutSourceActionCreators";

describe("heardAboutSourceReducer", () => {
  test("should initialize to blank array", () => {
    const newState = heardAboutSourceReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual([]);
  });

  test("should set given heardAboutSources on state", () => {
    const newHeardAboutSources = [[0, "Facebook"], [1, "Friend"]];

    const newState = heardAboutSourceReducer(
      undefined,
      getHeardAboutSourcesSuccess(newHeardAboutSources)
    );

    expect(newState).toEqual(newHeardAboutSources);
  });
});
