import searchOfficersReducer from "./searchOfficersReducer";
import {
  clearSelectedOfficer,
  searchOfficersCleared,
  searchOfficersFailed,
  searchOfficersInitiated,
  searchOfficersSuccess,
  selectOfficer,
  selectUnknownOfficer
} from "../../actionCreators/officersActionCreators";

describe("searchOfficersReducer", () => {
  describe("SEARCH_OFFICERS_SUCCESS", () => {
    test("sets state include search results and hide spinner", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: true,
        officerCurrentlySelected: true
      };
      const searchResults = [{ firstName: "Bob" }];
      const newState = searchOfficersReducer(
        initialState,
        searchOfficersSuccess(searchResults)
      );

      const expectedState = {
        searchResults: [{ firstName: "Bob" }],
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };
      expect(newState).toEqual(expectedState);
    });
  });
  describe("SEARCH_OFFICERS_INITIATED", () => {
    test("clears previous officer search results and shows spinner", () => {
      const initialState = {
        searchResults: [{ firstName: "someone" }],
        spinnerVisible: false,
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(
        initialState,
        searchOfficersInitiated()
      );
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: true,
        selectedOfficerData: null,
        officerCurrentlySelected: false
      });
    });
  });

  describe("SEARCH_OFFICERS_FAILED", () => {
    test("hide the spinner when search fails", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: true,
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(
        initialState,
        searchOfficersFailed()
      );
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: false
      });
    });
  });

  describe("SEARCH_OFFICERS_CLEARED", () => {
    test("clear search results, hide spinner, and retain selected officer", () => {
      const officer = { firstName: "selected", lastName: "officer" };
      const initialState = {
        searchResults: [{ firstName: "someone" }],
        spinnerVisible: true,
        selectedOfficerData: officer,
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(
        initialState,
        searchOfficersCleared()
      );
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: officer,
        officerCurrentlySelected: true
      });
    });
  });

  describe("OFFICER_SELECTED", () => {
    test("set selected officer", () => {
      const initialState = {
        searchResults: [{ firstName: "someone" }],
        spinnerVisible: false,
        selectedOfficerData: {},
        officerCurrentlySelected: false
      };
      const officer = { firstName: "selected", lastName: "officer" };
      const newState = searchOfficersReducer(
        initialState,
        selectOfficer(officer)
      );
      expect(newState).toEqual({
        searchResults: [{ firstName: "someone" }],
        spinnerVisible: false,
        selectedOfficerData: officer,
        officerCurrentlySelected: true
      });
    });
  });

  describe("CLEAR_SELECTED_OFFICER", () => {
    test("clear the selected officer", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: { firstName: "bob" },
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(
        initialState,
        clearSelectedOfficer()
      );
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: false
      });
    });
  });

  describe("UNKNOWN_OFFICER_SELECTED", () => {
    test("select unknown officer", () => {
      const initialState = {
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };
      const newState = searchOfficersReducer(
        initialState,
        selectUnknownOfficer()
      );
      expect(newState).toEqual({
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: true
      });
    });
  });
});
