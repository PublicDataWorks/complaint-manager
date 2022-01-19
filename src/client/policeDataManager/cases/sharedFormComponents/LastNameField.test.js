import React from "react";
import LastNameField from "./LastNameField";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { mount } from "enzyme/build/index";
import { changeInput } from "../../../testHelpers";

describe("Last Name field", () => {
  let lastNameField, lastNameInput;

  beforeEach(() => {
    const ReduxFormField = reduxForm({ form: "testForm" })(() => (
      <LastNameField name={"lastName"} />
    ));
    const store = createConfiguredStore();
    lastNameField = mount(
      <Provider store={store}>
        <ReduxFormField />
      </Provider>
    );
    lastNameInput = lastNameField
      .find('input[data-testid="lastNameInput"]')
      .last();
  });

  test("last name should have max length of 25 characters", () => {
    const lastName = lastNameField.find('input[data-testid="lastNameInput"]');
    expect(lastName.props().maxLength).toEqual(25);
  });

  test("last name should not use autoComplete", () => {
    const lastName = lastNameField.find('input[data-testid="lastNameInput"]');
    expect(lastName.props().autoComplete).toEqual("off");
  });

  test("should not be an empty string", () => {
    lastNameInput.simulate("focus");
    changeInput(lastNameInput, '[data-testid="lastNameInput"]', "");
    lastNameInput.simulate("blur");

    expect(lastNameField.text()).toContain("Please enter Last Name");
  });

  test("should display error when whitespace", () => {
    lastNameInput.simulate("focus");
    lastNameInput.simulate("change", { target: { value: "   " } });
    lastNameInput.simulate("blur");

    expect(lastNameField.text()).toContain("Please enter Last Name");
  });
});
