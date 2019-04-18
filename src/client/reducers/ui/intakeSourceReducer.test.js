import intakeSourceReducer from "./intakeSourceReducer";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";

describe("intakeSourceReducer", () => {
  test("should initialize to blank array", () => {
    const newState = intakeSourceReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual([]);
  });

  test("should set given intakeSources on state", () => {
    const newIntakeSources = [["Email", 0], ["NOIPM Website", 1]];

    const newState = intakeSourceReducer(
      undefined,
      getIntakeSourcesSuccess(newIntakeSources)
    );

    expect(newState).toEqual(newIntakeSources);
  });
});
