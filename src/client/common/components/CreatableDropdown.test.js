import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { Field, reduxForm } from "redux-form";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";
import { selectCreatableDropdownOption } from "../../testHelpers";
import CreatableDropdown, { getSelectedOption } from "./CreatableDropdown";

const children = [
  { label: "label 1", value: 1 },
  { label: "label 2", value: 2 }
];
describe("CreatableDropdown test", () => {
  let store, wrapper, TestForm;
  beforeEach(() => {
    store = createConfiguredStore();

    TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
      return (
        <Field
          label="TEST LABEL"
          name="testDropdownID"
          data-test="testDropdown"
          input={{ value: { label: "label 2", value: 2 } }}
          component={CreatableDropdown}
        >
          {children}
        </Field>
      );
    });

    wrapper = mount(
      <Provider store={store}>
        <Dialog open={true}>
          <DialogContent>
            <TestForm />
          </DialogContent>
        </Dialog>
      </Provider>
    );
  });

  test("should create menuItems from options array", () => {
    const autocomplete = wrapper
      .find('[data-test="testDropdown"]')
      .first()
      .find("ForwardRef(Autocomplete)")
      .props().options;

    expect(autocomplete.length).toEqual(2);
  });

  test("value passed in should be value of drop down", () => {
    const autocomplete = wrapper
      .find('[data-test="testDropdown"]')
      .first()
      .find("ForwardRef(Autocomplete)")
      .props();

    expect(autocomplete.value).toEqual({
      value: 2,
      label: "label 2"
    });
  });

  test("ensure input.onChange is happening on dropdown selection", () => {
    const onChangeSpy = jest.fn();
    TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
      return (
        <Field
          label="TEST LABEL"
          name="testDropdownID"
          data-test="testDropdown"
          input={{ onChange: onChangeSpy }}
          component={CreatableDropdown}
        >
          {children}
        </Field>
      );
    });

    wrapper = mount(
      <Provider store={store}>
        <Dialog open={true}>
          <DialogContent>
            <TestForm />
          </DialogContent>
        </Dialog>
      </Provider>
    );

    selectCreatableDropdownOption(
      wrapper,
      '[data-test="testDropdown"]',
      "label 1"
    );

    expect(onChangeSpy).toHaveBeenCalledWith({ label: "label 1", value: 1 });
  });

  describe("getSelectedOption test", () => {
    test("should return existing option when given an input that is an existing option", () => {
      const props = {
        input: {
          value: 2,
          label: "label 2"
        }
      };
      const selectedValue = getSelectedOption(props.input.label, children);

      expect(selectedValue).toEqual({ label: "label 2", value: 2 });
    });

    test("should return new option when given an input that is new input", () => {
      const props = {
        input: {
          value: "New string",
          label: "New string"
        }
      };
      const selectedValue = getSelectedOption(props.input.label, children);

      expect(selectedValue).toEqual({
        label: "New string",
        value: "New string"
      });
    });
  });
});
