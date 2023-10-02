import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AdminPortal from "./AdminPortal";
import createConfiguredStore from "../../createConfiguredStore";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";

describe("AdminPortal", () => {
  let store;
  beforeEach(() => {
    store = createConfiguredStore();
  });

  test("should show loading message when no permissions are set", () => {
    render(
      <Provider store={store}>
        <Router>
          <AdminPortal />
        </Router>
      </Provider>
    );

    expect(screen.getAllByText("Loading...")[0]).toBeInTheDocument;
  });

  test("should display the signatures card and letter types card when you have permissions", () => {
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.ADMIN_ACCESS] }
    });

    render(
      <Provider store={store}>
        <Router>
          <AdminPortal />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Signatures")).toBeInTheDocument;
    expect(screen.getByText("Letters")).toBeInTheDocument;
  });
});
