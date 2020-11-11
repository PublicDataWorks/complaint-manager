import { mount } from "enzyme";
import DashboardGlossary from "./DashboardGlossary";
import React from "react";

describe("Dashboard Glossary page", () => {
  test("should render the Glossary page for the public data dashboard with correct styling", () => {
    const wrapper = mount(<DashboardGlossary />);

    expect(wrapper).toMatchSnapshot();
  });
});
