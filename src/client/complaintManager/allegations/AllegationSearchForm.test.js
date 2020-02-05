import React from "react";
import { mount } from "enzyme";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import AllegationSearchForm from "./AllegationSearchForm";
import { selectDropdownOption } from "../../testHelpers";
import { change } from "redux-form";
import { ALLEGATION_SEARCH_FORM_NAME } from "../../../sharedUtilities/constants";
import getAllegationDropdownValues from "../cases/thunks/getAllegationDropdownValues";
import getSearchResults from "../shared/thunks/getSearchResults";

jest.mock("../cases/thunks/getAllegationDropdownValues", () => () => ({
  type: "GET_ALLEGATIONS_SUCCEEDED",
  allegations: [{ rule: "Rule 1", paragraphs: ["1", "2"] }]
}));

jest.mock("../shared/thunks/getSearchResults", () =>
  jest.fn((searchCriteria, resourceToSearch, paginatingSearch, newPage) => ({
    type: "MOCK_ACTION",
    searchCriteria,
    resourceToSearch,
    paginatingSearch,
    newPage
  }))
);

describe("AllegationSearchForm", () => {
  test("should clear paragraph value when rule deselected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <AllegationSearchForm />
      </Provider>
    );

    selectDropdownOption(wrapper, '[data-testid="ruleDropdown"]', "Rule 1");
    wrapper.update();
    selectDropdownOption(
      wrapper,
      '[data-testid="ruleDropdown"]',
      "Select a Rule"
    );
    wrapper.update();

    expect(dispatchSpy).toHaveBeenCalledWith(
      change(ALLEGATION_SEARCH_FORM_NAME, "paragraph", "")
    );
  });

  test("should retrieve dropdown values from database", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    mount(
      <Provider store={store}>
        <AllegationSearchForm />
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(getAllegationDropdownValues());
  });

  test("should pass expected options to thunk", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <AllegationSearchForm />
      </Provider>
    );

    selectDropdownOption(wrapper, '[data-testid="ruleDropdown"]', "Rule 1");
    wrapper.update();

    const searchButton = wrapper
      .find('[data-testid="allegationSearchSubmitButton"]')
      .first();
    searchButton.simulate("click");

    const expectedSearchCriteria = { rule: "Rule 1" };
    const expectedResourceToSearch = "allegations";
    const expectedPaginatingSearch = false;
    const expectedNewPage = 1;

    expect(dispatchSpy).toHaveBeenCalledWith(
      getSearchResults(
        expectedSearchCriteria,
        expectedResourceToSearch,
        expectedPaginatingSearch,
        expectedNewPage
      )
    );
  });
});
