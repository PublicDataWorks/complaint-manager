import React from "react";
import { mount } from "enzyme";
import NavBar from "../shared/components/NavBar/NavBar";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../createConfiguredStore";
import { openSnackbar } from "../actionCreators/snackBarActionCreators";
import { mockLocalStorage } from "../../../mockLocalStorage";
import { getArchivedCasesSuccess } from "../actionCreators/casesActionCreators";
import Case from "../../../sharedTestHelpers/case";
import ArchivedCases from "./ArchivedCases";
import getArchivedCases from "./thunks/getArchivedCases";
import { containsText } from "../../testHelpers";
import {
  CASE_STATUS,
  DESCENDING,
  SORT_CASES_BY
} from "../../../sharedUtilities/constants";

jest.mock("./thunks/getArchivedCases");
getArchivedCases.mockImplementation((sortBy, sortDirection, page) => ({
  type: "MOCK_GET_ARCHIVED_CASES_THUNK"
}));

describe("ArchivedCases", () => {
  let archivedCasesWrapper, store, dispatchSpy, cases;

  beforeEach(() => {
    getArchivedCases.mockClear();
    mockLocalStorage();

    const newCase = new Case.Builder().defaultCase().build();
    newCase.status = CASE_STATUS.INITIAL;
    const newCase2 = new Case.Builder().defaultCase().withId(1).build();
    newCase2.status = CASE_STATUS.INITIAL;
    cases = [newCase, newCase2];

    store = createConfiguredStore();
    store.dispatch(getArchivedCasesSuccess(cases));
    store.dispatch(openSnackbar());

    dispatchSpy = jest.spyOn(store, "dispatch");

    archivedCasesWrapper = mount(
      <Provider store={store}>
        <Router>
          <ArchivedCases />
        </Router>
      </Provider>
    );
  });

  test("should display message no archived cases", () => {
    store.dispatch(getArchivedCasesSuccess([]));
    archivedCasesWrapper.update();
    expect(
      containsText(
        archivedCasesWrapper,
        '[data-testid="searchResultsMessage"]',
        "There are no archived cases to view"
      )
    );
  });

  test("should display navbar with title", () => {
    const navBar = archivedCasesWrapper.find(NavBar);
    expect(navBar.contains("View Archived Cases")).toEqual(true);
  });

  test("should load all cases when mounted", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      getArchivedCases(SORT_CASES_BY.CASE_REFERENCE, DESCENDING)
    );
  });

  describe("table pagination", () => {
    test("should make an api call to get archived cases", () => {
      const casesTable = archivedCasesWrapper.find("CasesTable").instance();
      casesTable.onChange(12);

      expect(getArchivedCases).toHaveBeenCalledTimes(2);
      expect(getArchivedCases.mock.calls[1][2]).toEqual(12);
    });
  });
});
