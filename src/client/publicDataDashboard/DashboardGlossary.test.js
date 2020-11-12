import { mount } from "enzyme";
import DashboardGlossary from "./DashboardGlossary";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("Dashboard Glossary page", () => {
  test("should render the Glossary page for the public data dashboard with correct styling", () => {
    const wrapper = mount(
      <Router>
        <DashboardGlossary />
      </Router>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
