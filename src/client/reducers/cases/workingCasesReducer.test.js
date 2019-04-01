import workingCasesReducer from "./workingCasesReducer";
import {
  createCaseSuccess,
  getWorkingCasesSuccess,
  resetWorkingCasesLoaded
} from "../../actionCreators/casesActionCreators";

describe("workingCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = workingCasesReducer(undefined, { type: "SOME_ACTION" });
    expect(newState).toEqual({ loaded: false, cases: [], totalCaseCount: 0 });
  });

  describe("RESET_WORKING_CASES_LOADED", () => {
    test("should set loaded to false", () => {
      const oldState = {
        loaded: true,
        cases: ["case a", "case b"],
        totalCaseCount: 5
      };
      const action = resetWorkingCasesLoaded();

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual({
        loaded: false,
        cases: oldState.cases,
        totalCaseCount: oldState.totalCaseCount
      });
    });
  });

  describe("GET_WORKING_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = {
        loaded: false,
        cases: ["case a", "case b"],
        totalCaseCount: 5
      };
      const action = getWorkingCasesSuccess(["case 1", "case 2"], 10);

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toStrictEqual({
        loaded: true,
        cases: action.cases,
        totalCaseCount: action.totalCaseCount
      });
    });
  });

  describe("CASE_CREATED_SUCCESS", () => {
    test("should add new case to state", () => {
      const action = createCaseSuccess("case details");
      const oldState = { cases: [], loaded: true, totalCaseCount: 0 };

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual(
        expect.objectContaining({ cases: ["case details"], totalCaseCount: 1 })
      );
    });
  });
});
