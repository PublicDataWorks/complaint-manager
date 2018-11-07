import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { mount } from "enzyme/build/index";
import PhoneNumberField from "./PhoneNumberField";
import { changeInput, containsValue } from "../../testHelpers";

describe("Phone number field", () => {
  let phoneNumberFieldComponent;

  beforeEach(() => {
    const ReduxFormField = reduxForm({ form: "testForm" })(() => (
      <PhoneNumberField name={"phoneNumber"} />
    ));
    const store = createConfiguredStore();
    phoneNumberFieldComponent = mount(
      <Provider store={store}>
        <ReduxFormField />
      </Provider>
    );
  });

  test("should display error when phone number is invalid", () => {
    const phoneNumberInput = phoneNumberFieldComponent.find(
      'input[data-test="phoneNumberInput"]'
    );

    phoneNumberInput.simulate("focus");
    phoneNumberInput.simulate("change", { target: { value: "123" } });
    phoneNumberInput.simulate("blur");

    const phoneNumberField = phoneNumberFieldComponent.find(
      'div[data-test="phoneNumberField"]'
    );
    expect(phoneNumberField.text()).toContain(
      "Please enter a numeric 10 digit value"
    );
  });

  test("should display number with 1 parentheses when under length of 3", () => {
    changeInput(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "12"
    );
    containsValue(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "(12 )    -    "
    );
  });

  test("should display number with 1 parentheses when length of 3", () => {
    changeInput(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "123"
    );
    containsValue(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "(123)    -    "
    );
  });

  test("should display number with parentheses and space with length > 3", () => {
    changeInput(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "(123) 4"
    );
    containsValue(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "(123) 4  -    "
    );
  });

  test("should display nothing when bad input entered", () => {
    changeInput(
      phoneNumberFieldComponent,
      '[data-test="phoneNumberInput"]',
      "abc"
    );
      const phoneNumberField = phoneNumberFieldComponent.find(
          '[data-test="phoneNumberInput"]').last();

      expect(phoneNumberField.instance().value.replace(/\s+/g, '')).toEqual("()-")
  });
});
