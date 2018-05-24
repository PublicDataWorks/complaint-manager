import React from "react";
import { mount } from "enzyme";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";
import AllegationSearchForm from "./AllegationSearchForm";
import { selectDropdownOption } from "../../testHelpers";
import { change } from "redux-form";
import { ALLEGATION_SEARCH_FORM_NAME } from "../../sharedUtilities/constants";
import getAllegationDropdownValues from "../cases/thunks/getAllegationDropdownValues";

jest.mock("../cases/thunks/getAllegationDropdownValues", () => () => ({
  type: "MOCK_ACTION"
}));

describe("AllegationSearchForm", () => {
  test("should clear paragraph value when rule deselected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <AllegationSearchForm />
      </Provider>
    );

    selectDropdownOption(
      wrapper,
      '[data-test="ruleField"]',
      "Rule 2: Moral Conduct"
    );
    wrapper.update();
    selectDropdownOption(wrapper, '[data-test="ruleField"]', "Select a Rule");
    wrapper.update();

    expect(dispatchSpy).toHaveBeenCalledWith(
      change(ALLEGATION_SEARCH_FORM_NAME, "paragraph", "")
    );
  });
});

describe("AllegationSearchForm", () => {
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
});
