import { mount } from "enzyme";
import React from "react";
import PublicDataDashboard from "./PublicDataDashboard";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from 'react-redux';

jest.mock("../common/components/Visualization/Visualization", () => () =>
  "Visualization"
);

jest.mock("./DashboardDataSection", () => () => "DashboardDataSection");

describe("Public Data Dashboard", () => {
  test("should render public data dashboard with correct styling", () => {
    const store = createConfiguredStore();
    // Stub out Date for Last Updated Date on Snapshot
    Date.now = jest.fn(() => 1403900852194);

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <PublicDataDashboard />
        </Router>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
