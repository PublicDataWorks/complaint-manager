import React from "react";
import { mount } from "enzyme";
import CaseDashboard from "./CaseDashboard";
import NavBar from "../shared/components/NavBar/NavBar";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../createConfiguredStore";
import { openSnackbar } from "../actionCreators/snackBarActionCreators";
import { mockLocalStorage } from "../../../mockLocalStorage";
import { getWorkingCasesSuccess } from "../actionCreators/casesActionCreators";
import Case from "../testUtilities/case";
import getWorkingCases from "./thunks/getWorkingCases";
import { containsText } from "../../testHelpers";
import { DESCENDING, SORT_CASES_BY } from "../../../sharedUtilities/constants";

jest.mock("./thunks/getWorkingCases", () => () => ({
  type: "MOCK_GET_CASES_THUNK"
}));

describe("CaseDashboard", () => {
  let caseDashboardWrapper, store, dispatchSpy, cases;

  beforeEach(() => {
    mockLocalStorage();

    const newCase = new Case.Builder().defaultCase().build();
    const newCase2 = new Case.Builder()
      .defaultCase()
      .withId(1)
      .build();
    cases = [newCase, newCase2];

    store = createConfiguredStore();
    store.dispatch(getWorkingCasesSuccess(cases));
    store.dispatch(openSnackbar());

    dispatchSpy = jest.spyOn(store, "dispatch");

    caseDashboardWrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseDashboard />
        </Router>
      </Provider>
    );
  });

  test("should display no cases message", () => {
    store.dispatch(getWorkingCasesSuccess([]));
    caseDashboardWrapper.update();

    expect(
      containsText(
        caseDashboardWrapper,
        '[data-testid="searchResultsMessage"]',
        "There are no cases to view"
      )
    );
  });

  test("should display navbar with title", () => {
    const navBar = caseDashboardWrapper.find(NavBar);
    expect(navBar.contains("View All Cases")).toEqual(true);
  });

  test("should load all cases when mounted", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      getWorkingCases(SORT_CASES_BY.CASE_REFERENCE, DESCENDING)
    );
  });

  test("should close snackbar when mounted", () => {
    expect(store.getState()).toHaveProperty("ui.snackbar.open", false);
  });
});
