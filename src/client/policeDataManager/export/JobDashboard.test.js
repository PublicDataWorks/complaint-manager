import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import JobDashboard from "./JobDashboard";
import createConfiguredStore from "../../createConfiguredStore";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";

describe("JobDashboard", () => {
  let store;
  beforeEach(() => {
    store = createConfiguredStore();
  });

  test("should show loading message when no permissions are set", () => {
    render(
      <Provider store={store}>
        <Router>
          <JobDashboard />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should display the exports page when you have permissions", () => {
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
    });

    render(
      <Provider store={store}>
        <Router>
          <JobDashboard />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Export Cases")).toBeInTheDocument();
  });
});
