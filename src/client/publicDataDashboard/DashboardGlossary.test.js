import { mount } from "enzyme";
import DashboardGlossary from "./DashboardGlossary";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";

describe("Dashboard Glossary page", () => {
  test("should render the Glossary page for the public data dashboard with correct styling", () => {
    const store = createConfiguredStore();
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <DashboardGlossary />
        </Router>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
