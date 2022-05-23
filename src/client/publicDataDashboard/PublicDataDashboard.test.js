import { mount } from "enzyme";
import React from "react";
import PublicDataDashboard from "./PublicDataDashboard";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";
import {
  CONFIGS,
  GET_CONFIGS_SUCCEEDED
} from "../../sharedUtilities/constants";

jest.mock(
  "../common/components/Visualization/Visualization",
  () => () => "Visualization"
);

jest.mock("./DashboardDataSection", () => () => "DashboardDataSection");

describe("Public Data Dashboard", () => {
  test("should render public data dashboard with correct styling", () => {
    const store = createConfiguredStore();
    store.dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: {
        [CONFIGS.ORGANIZATION]: "OIPM",
        [CONFIGS.ORGANIZATION_TITLE]:
          "Office of the Independent Police Monitor",
        [CONFIGS.CITY]: "New Orleans",
        [CONFIGS.PD]: "NOPD"
      }
    });

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
