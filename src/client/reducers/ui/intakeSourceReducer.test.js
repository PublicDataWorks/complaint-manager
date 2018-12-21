import intakeSourceReducer from "./intakeSourceReducer";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";

describe("intakeSourceReducer", () => {
  test("should initialize to blank array", () => {
    const newState = intakeSourceReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual([]);
  });

  test("should set given intakeSources on state", () => {
    const newIntakeSources = [[0, "Email"], [1, "NOIPM Website"]];

    const newState = intakeSourceReducer(
      undefined,
      getIntakeSourcesSuccess(newIntakeSources)
    );

    expect(newState).toEqual(newIntakeSources);
  });
});
