import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import CustomConfigPage from "./CustomConfigPage";
import createConfiguredStore from "../../createConfiguredStore";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";

describe("CustomConfigPage", () => {
  let store;
  beforeEach(() => {
    store = createConfiguredStore();
  });

  test("should show loading message when no permissions are set", () => {
    render(
      <Provider store={store}>
        <Router>
          <CustomConfigPage />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument;
  });

  test("should display the letter types card when you have permissions", () => {
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.ADMIN_ACCESS] }
    });

    render(
      <Provider store={store}>
        <Router>
          <CustomConfigPage />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Letter Types")).toBeInTheDocument;
  });
});
