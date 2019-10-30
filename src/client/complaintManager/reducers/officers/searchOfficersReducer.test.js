import searchOfficersReducer from "./searchOfficersReducer";
import {
  clearSelectedOfficer,
  selectCaseOfficer,
  selectOfficer,
  selectUnknownOfficer
} from "../../actionCreators/officersActionCreators";
import {
  searchCleared,
  searchFailed,
  searchInitiated,
  searchSuccess
} from "../../actionCreators/searchActionCreators";
import CaseOfficer from "../../testUtilities/caseOfficer";

describe("searchOfficersReducer", () => {
  describe("SEARCH_SUCCESS", () => {
    test("clear selection when successful search", () => {
      const initialState = {
        selectedOfficerData: { someSelectedOfficer: "Some data" },
        officerCurrentlySelected: true
      };
      const searchResults = [{ firstName: "Bob" }];
      const newState = searchOfficersReducer(
        initialState,
        searchSuccess(searchResults)
      );

      const expectedState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };
      expect(newState).toEqual(expectedState);
    });
  });

  describe("SEARCH_INITIATED", () => {
    test("clears selected officer when search initiated", () => {
      const initialState = {
        searchResults: [{ firstName: "someone" }],
        spinnerVisible: false,
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(initialState, searchInitiated());
      expect(newState).toEqual({
        selectedOfficerData: null,
        officerCurrentlySelected: false
      });
    });
  });

  describe("SEARCH_FAILED", () => {
    test("clear selected officer when search fails", () => {
      const initialState = {
        selectedOfficerData: { someSelectedOfficer: "Some data" },
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(initialState, searchFailed());
      expect(newState).toEqual({
        selectedOfficerData: null,
        officerCurrentlySelected: false
      });
    });
  });

  describe("SEARCH_CLEARED", () => {
    test("retain selected officer when search cleared", () => {
      const officer = { firstName: "selected", lastName: "officer" };
      const initialState = {
        selectedOfficerData: officer,
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(initialState, searchCleared());
      expect(newState).toEqual({
        selectedOfficerData: officer,
        officerCurrentlySelected: true
      });
    });
  });

  describe("OFFICER_SELECTED", () => {
    test("set selected officer", () => {
      const initialState = {
        selectedOfficerData: {},
        officerCurrentlySelected: false
      };
      const officer = { firstName: "selected", lastName: "officer" };
      const newState = searchOfficersReducer(
        initialState,
        selectOfficer(officer)
      );
      expect(newState).toEqual({
        selectedOfficerData: officer,
        officerCurrentlySelected: true
      });
    });
  });

  describe("CLEAR_SELECTED_OFFICER", () => {
    test("clear the selected officer", () => {
      const initialState = {
        selectedOfficerData: { firstName: "bob" },
        officerCurrentlySelected: true
      };
      const newState = searchOfficersReducer(
        initialState,
        clearSelectedOfficer()
      );
      expect(newState).toEqual({
        selectedOfficerData: null,
        officerCurrentlySelected: false
      });
    });
  });

  describe("UNKNOWN_OFFICER_SELECTED", () => {
    test("select unknown officer", () => {
      const initialState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };
      const newState = searchOfficersReducer(
        initialState,
        selectUnknownOfficer()
      );
      expect(newState).toEqual({
        selectedOfficerData: null,
        officerCurrentlySelected: true
      });
    });
  });

  describe("CASE_OFFICER_SELECTED", function() {
    test("officer data populated by selected case officer", () => {
      const initialState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };

      const caseOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(123)
        .withOfficerId(456);

      const newState = searchOfficersReducer(
        initialState,
        selectCaseOfficer(caseOfficer)
      );

      expect(newState).toEqual(
        expect.objectContaining({
          selectedOfficerData: expect.objectContaining({
            id: caseOfficer.officerId,
            firstName: caseOfficer.firstName,
            lastName: caseOfficer.lastName
          }),
          officerCurrentlySelected: true
        })
      );
    });
  });
});
