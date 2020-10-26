import { mount } from "enzyme";
import DashboardNavBar from "./DashboardNavBar";
import React from "react";

describe("Dashboard NavBar", () => {
  test("should render the navbar in the public data dashboard with correct styling", () => {
    const wrapper = mount(<DashboardNavBar />);

    expect(wrapper).toMatchSnapshot();
  });
});
