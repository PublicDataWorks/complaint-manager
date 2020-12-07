import { mount } from "enzyme";
import DashboardAbout from "./DashboardAbout";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from 'react-redux';

describe("Dashboard About page", () => {
  test("should render the About page for the public data dashboard with correct styling", () => {
    const store = createConfiguredStore();
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <DashboardAbout />
        </Router>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
