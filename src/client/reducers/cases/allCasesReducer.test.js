import allCasesReducer from "./allCasesReducer";
import {
  createCaseSuccess,
  getCasesSuccess
} from "../../actionCreators/casesActionCreators";

describe("allCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = allCasesReducer(undefined, { type: "SOME_ACTION" });
    expect(newState.cases).toEqual([]);
  });

  describe("GET_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = ["case a", "case b"];
      const action = getCasesSuccess(["case 1", "case 2"]);

      const newState = allCasesReducer(oldState, action);

      expect(newState.cases).toEqual(action.cases);
    });
  });

  describe("CASE_CREATED_SUCCESS", () => {
    test("should add new case to state", () => {
      const action = createCaseSuccess("case details");

      const newState = allCasesReducer({cases: []}, action);

      expect(newState.cases).toEqual(["case details"]);
    });
  });
});
