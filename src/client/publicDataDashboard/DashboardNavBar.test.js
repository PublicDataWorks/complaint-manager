import { mount } from "enzyme";
import DashboardNavBar from "./DashboardNavBar";
import React from "react";

describe("Dashboard NavBar", () => {
  test("should render the navbar in the public data dashboard with correct styling", () => {
    const wrapper = mount(<DashboardNavBar />);

    expect(wrapper).toMatchSnapshot();
  });

  test("should navigate to About page when About button is clicked on", async () => {
    const wrapper = mount(<DashboardNavBar />);
    const aboutLink = wrapper.find('[data-testid="aboutLink"]').first();

    aboutLink.simulate("click");

    expect(aboutLink.prop("href")).toEqual("/data/about");
  });
});
