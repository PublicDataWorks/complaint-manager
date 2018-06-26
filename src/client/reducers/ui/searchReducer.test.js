import searchReducer from "./searchReducer";
import {
  searchFailed,
  searchInitiated,
  searchSuccess
} from "../../actionCreators/searchActionCreators";
import {
  searchOfficersCleared,
  searchOfficersFailed
} from "../../actionCreators/officersActionCreators";

describe("searchReducer", () => {
  describe("SEARCH_INITIATED", () => {
    test("clears previous officer search results and shows spinner", () => {
      const initialState = {
        searchResults: [{ someSearchResult: "something" }],
        spinnerVisible: false
      };
      const newState = searchReducer(initialState, searchInitiated());
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: true
      });
    });
  });

  describe("SEARCH_SUCCESS", () => {
    test("sets state include search results, hide spinner, and update pagination page number", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: true,
        newPage: undefined
      };
      const searchResults = [{ someSearchResult: "something" }];
      const newPageNumber = 2;

      const newState = searchReducer(
        initialState,
        searchSuccess(searchResults, newPageNumber)
      );

      const expectedState = {
        searchResults: searchResults,
        spinnerVisible: false,
        newPage: newPageNumber
      };
      expect(newState).toEqual(expectedState);
    });
  });

  describe("SEARCH_FAILED", () => {
    test("hide the spinner when search fails", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: true
      };
      const newState = searchReducer(initialState, searchFailed());
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: false
      });
    });
  });
});
