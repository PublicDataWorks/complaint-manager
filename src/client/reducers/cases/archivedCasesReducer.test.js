import {
  getArchivedCasesSuccess,
  resetArchivedCasesLoaded,
  resetWorkingCasesLoaded
} from "../../actionCreators/casesActionCreators";
import archivedCasesReducer from "./archivedCasesReducer";
import workingCasesReducer from "./workingCasesReducer";

describe("archivedCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = archivedCasesReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toEqual({ loaded: false, cases: [], totalCaseCount: 0 });
  });

  describe("GET_ARCHIVED_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = {
        loaded: true,
        cases: ["case a", "case b"],
        totalCaseCount: 15
      };
      const action = getArchivedCasesSuccess(["case 1", "case 2"], 32);

      const newState = archivedCasesReducer(oldState, action);

      expect(newState).toEqual({
        loaded: true,
        cases: action.cases,
        totalCaseCount: action.totalCaseCount
      });
    });
  });
  describe("RESET_ARCHIVED_CASES_LOADED", () => {
    test("should set loaded to false", () => {
      const oldState = {
        loaded: true,
        cases: ["case a", "case b"],
        totalCaseCount: 5
      };
      const action = resetArchivedCasesLoaded();

      const newState = archivedCasesReducer(oldState, action);

      expect(newState).toEqual({
        loaded: false,
        cases: oldState.cases,
        totalCaseCount: oldState.totalCaseCount
      });
    });
  });
});
