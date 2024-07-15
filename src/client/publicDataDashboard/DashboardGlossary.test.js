import { render, screen } from "@testing-library/react";
import DashboardGlossary from "./DashboardGlossary";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";

describe("Dashboard Glossary page", () => {
  test("should render the Glossary page for the public data dashboard with correct styling", () => {
    const store = createConfiguredStore();
    render(
      <Provider store={store}>
        <Router>
          <DashboardGlossary />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId("dashboard-link")).toBeTruthy();
    expect(screen.getByText("Tag Glossary")).toBeTruthy();
  });
});
