import { mount } from "enzyme";
import React from "react";
import PublicDataDashboard from "./PublicDataDashboard";

jest.mock("../common/components/Visualization/Visualization", () => () =>
  "Visualization"
);

jest.mock("./DashboardDataSection", () => () => "DashboardDataSection");

describe("Public Data Dashboard", () => {
  test("should render public data dashboard with correct styling", () => {
    // Stub out Date for Last Updated Date on Snapshot
    Date.now = jest.fn(() => 1403900852194);

    const wrapper = mount(<PublicDataDashboard />);

    expect(wrapper).toMatchSnapshot();
  });
});
