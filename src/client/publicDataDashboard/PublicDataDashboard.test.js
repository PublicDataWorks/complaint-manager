import { mount } from "enzyme";
import React from "react";
import PublicDataDashboard from "./PublicDataDashboard";

jest.mock("../common/components/Visualization/Visualization", () => () =>
  "Visualization"
);

jest.mock("./DashboardDataSection", () => () => "DashboardDataSection");

describe("Public Data Dashboard", () => {
  test("should render public data dashboard with correct styling", () => {
    const wrapper = mount(<PublicDataDashboard />);

    expect(wrapper).toMatchSnapshot();
  });
});
