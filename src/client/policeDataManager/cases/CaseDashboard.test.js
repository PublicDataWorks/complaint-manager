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
import CaseModel from "../../../sharedTestHelpers/case";
import getWorkingCases from "./thunks/getWorkingCases";
import { containsText } from "../../testHelpers";
import {
  CASE_STATUS,
  DESCENDING,
  SORT_CASES_BY,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import CreateCaseButton from "./CreateCaseButton";
import moment from "moment";

jest.mock("./thunks/getWorkingCases", () => () => ({
  type: "MOCK_GET_CASES_THUNK"
}));

jest.mock("../../common/components/Visualization/PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

describe("CaseDashboard", () => {
  let caseDashboardWrapper, store, dispatchSpy, cases;

  beforeEach(async () => {
    mockLocalStorage();

    const newCase = new CaseModel.Builder().defaultCase().build();
    newCase.status = CASE_STATUS.INITIAL;
    const newCase2 = new CaseModel.Builder().defaultCase().withId(1).build();
    newCase2.status = CASE_STATUS.INITIAL;
    cases = [newCase, newCase2];

    store = createConfiguredStore();
    store.dispatch(getWorkingCasesSuccess(cases));
    store.dispatch(openSnackbar());

    dispatchSpy = jest.spyOn(store, "dispatch");
  });

  describe("with no create case permission", () => {
    beforeEach(() => {
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.EXPORT_AUDIT_LOG] }
      });
      caseDashboardWrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseDashboard />
          </Router>
        </Provider>
      );
    });

    test("should not display create case button", () => {
      expect(caseDashboardWrapper.find(CreateCaseButton)).toHaveLength(0);
    });
  });

  describe("with create case permission", () => {
    beforeEach(() => {
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.CREATE_CASE] }
      });

      caseDashboardWrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseDashboard />
          </Router>
        </Provider>
      );
    });

    test("should display create case button", () => {
      expect(caseDashboardWrapper.find(CreateCaseButton)).toHaveLength(1);
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

    test("should display complaint totals", () => {
      expect(
        containsText(
          caseDashboardWrapper,
          '[data-testid="complaintTotals"]',
          `Complaints YTD: Complaints ${moment()
            .subtract(1, "y")
            .format("YYYY")}: `
        )
      );
    });
  });
});
