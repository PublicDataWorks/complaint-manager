import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { mount } from "enzyme/build/index";
import PIBControlField from "./PIBControlField";
import { changeInput, containsValue } from "../../testHelpers";

describe("PIB Control Field", () => {
  let pibCaseFieldComponent;

  beforeEach(() => {
    const ReduxFormField = reduxForm({ form: "testForm" })(() => (
      <PIBControlField name={"pibCase"} />
    ));
    const store = createConfiguredStore();
    pibCaseFieldComponent = mount(
      <Provider store={store}>
        <ReduxFormField />
      </Provider>
    );
  });

  test("should not be an empty string", () => {
    const pibCaseInput = pibCaseFieldComponent.find(
      'input[data-test="pib-control-input"]'
    );

    pibCaseInput.simulate("focus");
    pibCaseInput.simulate("change", { target: { value: "" } });
    pibCaseInput.simulate("blur");

    expect(pibCaseFieldComponent.text()).toContain(
      "Please enter a PIB Control #"
    );
  });

  test("should not be blank", () => {
    const pibCaseInput = pibCaseFieldComponent.find(
      'input[data-test="pib-control-input"]'
    );

    pibCaseInput.simulate("focus");
    pibCaseInput.simulate("change", { target: { value: "  " } });
    pibCaseInput.simulate("blur");

    expect(pibCaseFieldComponent.text()).toContain(
      "Please enter a PIB Control #"
    );
  });

  test("should display error when pib case is invalid", () => {
    const pibCaseInput = pibCaseFieldComponent.find(
      'input[data-test="pib-control-input"]'
    );

    pibCaseInput.simulate("focus");
    pibCaseInput.simulate("change", { target: { value: "1230-1111-1" } });
    pibCaseInput.simulate("blur");

    const pibCaseField = pibCaseFieldComponent.find(
      'div[data-test="pib-control-field"]'
    );
    expect(pibCaseField.text()).toContain(
      "Please enter a valid PIB control number"
    );
  });

  test("should pass the pizza party test", () => {
    changeInput(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "8787---676-----pizza party 5-R6"
    );
    containsValue(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "8787-6765-R"
    );
  });

  test("should display only numbers when letters are entered", () => {
    changeInput(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "1234ab"
    );
    containsValue(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "1234-____-_"
    );
  });

  test("should display number with 2 dashes and spaces when length of 8", () => {
    changeInput(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "20191234"
    );

    const expectedString = "2019-1234-_";

    containsValue(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      expectedString
    );
  });

  test("should display number with dashes and space with length > 4", () => {
    changeInput(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "2019"
    );

    const expectedString = "2019-____-_";

    containsValue(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      expectedString
    );
  });

  test("should display nothing when bad input entered", () => {
    changeInput(
      pibCaseFieldComponent,
      '[data-test="pib-control-input"]',
      "#!@%"
    );
    const pibCaseNumber = pibCaseFieldComponent
      .find('[data-test="pib-control-input"]')
      .last();

    expect(pibCaseNumber.instance().value.replace(/\s+/g, "")).toEqual("");
  });
});
