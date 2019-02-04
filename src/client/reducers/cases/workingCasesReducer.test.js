import workingCasesReducer from "./workingCasesReducer";
import {
  createCaseSuccess,
  getCasesSuccess,
  resetWorkingCasesLoaded
} from "../../actionCreators/casesActionCreators";

describe("workingCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = workingCasesReducer(undefined, { type: "SOME_ACTION" });
    expect(newState).toEqual({ loaded: false, cases: [] });
  });

  describe("RESET_WORKING_CASES_LOADED", () => {
    test("should set loaded to false", () => {
      const oldState = { loaded: true, cases: ["case a", "case b"] };
      const action = resetWorkingCasesLoaded();

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual({ loaded: false, cases: oldState.cases });
    });
  });

  describe("GET_WORKING_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = { loaded: false, cases: ["case a", "case b"] };
      const action = getCasesSuccess(["case 1", "case 2"]);

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual({ loaded: true, cases: action.cases });
    });
  });

  describe("CASE_CREATED_SUCCESS", () => {
    test("should add new case to state", () => {
      const action = createCaseSuccess("case details");
      const oldState = { cases: [], loaded: true };

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual(
        expect.objectContaining({ cases: ["case details"] })
      );
    });
  });
});
