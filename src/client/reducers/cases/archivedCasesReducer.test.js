import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";
import archivedCasesReducer from "./archivedCasesReducer";

describe("archivedCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = archivedCasesReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toEqual({ loaded: false, cases: [] });
  });

  describe("GET_ARCHIVED_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = { loaded: true, cases: ["case a", "case b"] };
      const action = getArchivedCasesSuccess(["case 1", "case 2"]);

      const newState = archivedCasesReducer(oldState, action);

      expect(newState).toEqual({ loaded: true, cases: action.cases });
    });
  });
});
