import React from "react";
import { changeInput, containsText, containsValue } from "../../../testHelpers";
import { reduxForm } from "redux-form";
import createConfiguredStore from "../../../createConfiguredStore";
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

    suffixInput = form.find('[data-testid="suffixInput"]').last();
    suffixField = form.find('[data-testid="suffixField"]');
  });

  test("should have a suffix field", () => {
    expect(suffixField.exists()).toBeTruthy();
  });

  test("should have a label Suffix", () => {
    containsText(form, '[data-testid="suffixField"]', "Suffix");
  });

  test("should be alphanumerical and not contain # /", () => {
    const validInput = "the 4th";
    const invalidInput = "asa sd / f #asdf,.|~";

    changeInput(form, '[data-testid="suffixInput"]', validInput);
    changeInput(form, '[data-testid="suffixInput"]', invalidInput);

    containsValue(form, '[data-testid="suffixInput"]', validInput);
  });
});
