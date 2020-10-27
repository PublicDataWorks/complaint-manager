import { mount } from "enzyme";
import DashboardAbout from "./DashboardAbout";
import React from "react";

describe("Dashboard About page", () => {
  test("should render the About page for the public data dashboard with correct styling", () => {
    const wrapper = mount(<DashboardAbout />);

    expect(wrapper).toMatchSnapshot();
  });
});
