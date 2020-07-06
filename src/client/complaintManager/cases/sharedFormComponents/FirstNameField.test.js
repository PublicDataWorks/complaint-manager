import React from "react";
import FirstNameField from "./FirstNameField";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { mount } from "enzyme/build/index";
import createConfiguredStore from "../../../createConfiguredStore";
import { changeInput } from "../../../testHelpers";

describe("First name field", () => {
  let firstNameField, firstNameInput;

  beforeEach(() => {
    const ReduxFormField = reduxForm({ form: "testForm" })(() => (
      <FirstNameField name={"firstName"} />
    ));
    const store = createConfiguredStore();
    firstNameField = mount(
      <Provider store={store}>
        <ReduxFormField />
      </Provider>
    );
    firstNameInput = firstNameField
      .find('input[data-testid="firstNameInput"]')
      .last();
  });

  test("first name should have max length of 25 characters", () => {
    const firstName = firstNameField.find(
      'input[data-testid="firstNameInput"]'
    );
    expect(firstName.props().maxLength).toEqual(25);
  });

  test("should not be an empty string", () => {
    firstNameInput.simulate("focus");
    changeInput(firstNameInput, '[data-testid="firstNameInput"]', "");
    firstNameInput.simulate("blur");

    expect(firstNameField.text()).toContain("Please enter First Name");
  });

  test("should display error when whitespace", () => {
    firstNameInput.simulate("focus");
    firstNameInput.simulate("change", { target: { value: "   " } });
    firstNameInput.simulate("blur");

    expect(firstNameField.text()).toContain("Please enter First Name");
  });

  test("first name should not use autoComplete", () => {
    const firstName = firstNameField.find(
      'input[data-testid="firstNameInput"]'
    );
    expect(firstName.props().autoComplete).toEqual("off");
  });
});
