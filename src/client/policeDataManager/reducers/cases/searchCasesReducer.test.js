import searchCasesReducer from "./searchCasesReducer";
import {
  createCaseSuccess,
  getWorkingCasesSuccess,
  resetWorkingCasesLoaded
} from "../../actionCreators/casesActionCreators";
import { searchSuccess } from "../../actionCreators/searchActionCreators";
import { searchCasesSuccess } from "../../actionCreators/searchCasesActionCreators";

describe("searchCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = searchCasesReducer(undefined, { type: "SOME_ACTION" });
    expect(newState).toStrictEqual({
      loaded: false,
      cases: [],
      totalCaseCount: 0,
      currentPage: 1,
      errorMsg: null
    });
  });

  describe("SEARCH_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = {
        loaded: false,
        cases: ["case a", "case b"],
        totalCaseCount: 5,
        currentPage: 1
      };

      const newPage = 1;
      const searchResults = {
        rows: ["case 1", "case 2"],
        totalRecords: 2
      };

      const action = searchCasesSuccess(searchResults, newPage);

      const newState = searchCasesReducer(oldState, action);

      expect(newState).toStrictEqual({
        loaded: true,
        cases: action.searchResults.rows,
        totalCaseCount: action.searchResults.totalRecords,
        currentPage: 1
      });
    });
  });
});
