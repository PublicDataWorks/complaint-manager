import { MuiThemeProvider } from "@material-ui/core/styles";
import { mount } from "enzyme";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardNavBar from "./DashboardNavBar";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";

describe("Dashboard NavBar", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <MuiThemeProvider theme={dashboardStylingDesktop}>
          <DashboardNavBar />
        </MuiThemeProvider>
      </Router>
    );
  });

  test("should navigate to About page when About button is clicked on", async () => {
    const aboutLink = wrapper.find('[data-testid="aboutLink"]').first();

    aboutLink.simulate("click");

    expect(aboutLink.prop("to")).toEqual("/data/about");
  });

  test("should navigate to glossary page when Glossary button is clicked on", async () => {
    const glossaryLink = wrapper.find('[data-testid="glossaryLink"]').first();

    glossaryLink.simulate("click");

    expect(glossaryLink.prop("to")).toEqual("/data/glossary");
  });
});
