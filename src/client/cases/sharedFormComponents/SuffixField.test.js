import React from "react";
import { changeInput, containsText, containsValue } from "../../../testHelpers";
import { reduxForm } from "redux-form";
import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import SuffixField from "./SuffixField";
import { Provider } from "react-redux";

describe("suffix", () => {
  let ReduxForm, form, suffixInput, suffixField;
  beforeEach(() => {
    ReduxForm = reduxForm({ form: "testForm" })(() => {
      return <SuffixField name="suffixFieldTest" />;
    });

    const store = createConfiguredStore();
    form = mount(
      <Provider store={store}>
        <ReduxForm />
      </Provider>
    );

    suffixInput = form.find('[data-test="suffixInput"]').last();
    suffixField = form.find('[data-test="suffixField"]');
  });

  test("should have a suffix field", () => {
    expect(suffixField.exists()).toBeTruthy();
  });

  test("should have a label Suffix", () => {
    containsText(form, '[data-test="suffixField"]', "Suffix");
  });

  test("should be alphanumerical and not contain # /", () => {
    const validInput = "the 4th";
    const invalidInput = "asa sd / f #asdf,.|~";

    changeInput(form, '[data-test="suffixInput"]', validInput);
    changeInput(form, '[data-test="suffixInput"]', invalidInput);

    containsValue(form, '[data-test="suffixInput"]', validInput);
  });
});
