import workingCasesReducer from "./workingCasesReducer";
import {
  createCaseSuccess,
  getWorkingCasesSuccess,
  resetWorkingCasesLoaded
} from "../../actionCreators/casesActionCreators";
import { searchSuccess } from "../../actionCreators/searchActionCreators";
import {
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";

describe("workingCasesReducer", () => {
  test("should default to empty array", () => {
    const newState = workingCasesReducer(undefined, { type: "SOME_ACTION" });
    expect(newState).toStrictEqual({
      loaded: false,
      cases: [],
      totalCaseCount: 0,
      currentPage: 1,
      sortBy: SORT_CASES_BY.CASE_REFERENCE,
      sortDirection: DESCENDING
    });
  });

  describe("RESET_WORKING_CASES_LOADED", () => {
    test("should set loaded to false", () => {
      const oldState = {
        loaded: true,
        cases: ["case a", "case b"],
        totalCaseCount: 5,
        currentPage: 1
      };
      const action = resetWorkingCasesLoaded();

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual({
        loaded: false,
        cases: oldState.cases,
        totalCaseCount: oldState.totalCaseCount,
        currentPage: oldState.currentPage
      });
    });
  });

  describe("SEARCH_SUCCESS", () => {
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

      const action = searchSuccess(searchResults, newPage);

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toStrictEqual({
        loaded: true,
        cases: action.searchResults.rows,
        totalCaseCount: action.searchResults.totalRecords,
        currentPage: 1
      });
    });
  });

  describe("GET_WORKING_CASES_SUCCESS", () => {
    test("should replace all cases in state", () => {
      const oldState = {
        loaded: false,
        cases: ["case a", "case b"],
        totalCaseCount: 5,
        currentPage: 1
      };
      const action = getWorkingCasesSuccess(["case 1", "case 2"], 10, 2);

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toStrictEqual({
        loaded: true,
        cases: action.cases,
        totalCaseCount: action.totalCaseCount,
        currentPage: 2
      });
    });
  });

  describe("CASE_CREATED_SUCCESS", () => {
    test("should add new case to state", () => {
      const action = createCaseSuccess("case details");
      const oldState = {
        cases: [],
        loaded: true,
        totalCaseCount: 0,
        currentPage: 0
      };

      const newState = workingCasesReducer(oldState, action);

      expect(newState).toEqual(
        expect.objectContaining({ cases: ["case details"], totalCaseCount: 1 })
      );
    });
  });
});
