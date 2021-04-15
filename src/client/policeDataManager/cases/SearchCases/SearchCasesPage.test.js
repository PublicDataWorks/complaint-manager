import { mount } from "enzyme";
import React from "react";
import SearchCasesPage from "./SearchCasesPage";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from 'react-redux';

describe("Search Cases Page", () => {
  test("should render cases table with correct styling", () => {
    const store = createConfiguredStore();

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <SearchCasesPage />
        </Router>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
