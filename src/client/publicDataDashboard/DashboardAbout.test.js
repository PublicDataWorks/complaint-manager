import { mount } from "enzyme";
import DashboardAbout from "./DashboardAbout";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("Dashboard About page", () => {
  test("should render the About page for the public data dashboard with correct styling", () => {
    const wrapper = mount(
      <Router>
        <DashboardAbout />
      </Router>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
