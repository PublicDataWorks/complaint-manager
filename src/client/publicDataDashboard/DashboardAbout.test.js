import { render } from "@testing-library/react";
import DashboardAbout from "./DashboardAbout";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";
import {
  CONFIGS,
  GET_CONFIGS_SUCCEEDED
} from "../../sharedUtilities/constants";

describe("Dashboard About page", () => {
  test("should render the About page for the public data dashboard with correct styling", () => {
    const store = createConfiguredStore();
    store.dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: {
        [CONFIGS.ORGANIZATION_TITLE]:
          "Office of the Independent Police Monitor",
        [CONFIGS.CITY]: "New Orleans",
        [CONFIGS.PD]: "NOPD",
        [CONFIGS.ORGANIZATION]: "OIPM",
        [CONFIGS.BUREAU]: "Public Integrity Bureau"
      }
    });
    const dashboardAboutPage = render(
      <Provider store={store}>
        <Router>
          <DashboardAbout />
        </Router>
      </Provider>
    );

    expect(dashboardAboutPage.container).toMatchSnapshot();
  });
});
