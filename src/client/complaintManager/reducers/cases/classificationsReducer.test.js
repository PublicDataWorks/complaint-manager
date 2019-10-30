import classificationsReducer from "./classificationsReducer";
import { getClassificationsSuccess } from "../../actionCreators/letterActionCreators";

describe("classificationsReducer", function() {
  test("should initialize to blank array", () => {
    const newState = classificationsReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual([]);
  });

  test("should return classifications ", () => {
    const classifications = [
      { name: "Use of Force", message: "forceful" },
      { name: "Misconduct", message: "very bad" }
    ];
    const newState = classificationsReducer(
      undefined,
      getClassificationsSuccess(classifications)
    );
    expect(newState).toEqual(classifications);
  });
});
