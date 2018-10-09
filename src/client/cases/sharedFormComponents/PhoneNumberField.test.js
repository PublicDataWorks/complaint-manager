import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { mount } from "enzyme/build/index";
import PhoneNumberField from "./PhoneNumberField";

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
    phoneNumberInput.simulate("change", { target: { value: "bad-number" } });
    phoneNumberInput.simulate("blur");

    const phoneNumberField = phoneNumberFieldComponent.find(
      'div[data-test="phoneNumberField"]'
    );
    expect(phoneNumberField.text()).toContain(
      "Please enter a numeric 10 digit value"
    );
  });
});
