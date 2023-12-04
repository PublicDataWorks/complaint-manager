import { getPriorityLevelSuccess } from "../../actionCreators/priorityLevelActionCreators";
import priorityLevelReducer from "./priorityLevelReducer";

describe("priorityLevelReducer", () => {
  test("should initialize to blank array", () => {
    const newState = priorityLevelReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual([]);
  });

  test("should set given priorityLevels on state", () => {
    const newPriorityLevels = [
      ["Priority One", 0],
      ["Priority Two", 1]
    ];

    const newState = priorityLevelReducer(
      undefined,
      getPriorityLevelSuccess(newPriorityLevels)
    );

    expect(newState).toEqual(newPriorityLevels);
  });
});
