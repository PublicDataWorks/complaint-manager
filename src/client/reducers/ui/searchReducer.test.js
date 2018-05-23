import searchReducer from "./searchReducer";
import {
  searchCleared,
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
    test("sets state include search results and hide spinner", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: true
      };
      const searchResults = [{ someSearchResult: "something" }];

      const newState = searchReducer(
        initialState,
        searchSuccess(searchResults)
      );

      const expectedState = {
        searchResults: searchResults,
        spinnerVisible: false
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

  describe("SEARCH_CLEARED", () => {
    test("clear search results, hide spinner", () => {
      const initialState = {
        searchResults: [{ firstName: "someone" }],
        spinnerVisible: true
      };
      const newState = searchReducer(initialState, searchCleared());
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: false
      });
    });
  });
});
