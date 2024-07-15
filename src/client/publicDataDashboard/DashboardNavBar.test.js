import { render, screen } from "@testing-library/react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardNavBar from "./DashboardNavBar";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";

describe("Dashboard NavBar", () => {
  beforeEach(() => {
    render(
      <Router>
        <MuiThemeProvider theme={dashboardStylingDesktop}>
          <DashboardNavBar />
        </MuiThemeProvider>
      </Router>
    );
  });

  test("should have an about link", async () => {
    const aboutLink = screen.getByTestId("aboutLink");

    expect(aboutLink).toBeTruthy();
  });

  test("should have a glossary button", async () => {
    const glossaryLink = screen.getByTestId("glossaryLink");

    expect(glossaryLink).toBeTruthy();
  });
});
