import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { Field, reduxForm } from "redux-form";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";
import {
  changeCreatableDropdownInput,
  selectCreatableDropdownOption
} from "../../testHelpers";
import CreatableDropdown, { getSelectedOption } from "./CreatableDropdown";

let children = [
  { label: "label 1", value: 1 },
  { label: "label 2", value: 2 }
];
describe("CreatableDropdown test", () => {
  let store, wrapper, TestForm, autocomplete;

  describe("Creating new tag", () => {
    const onChangeSpy = jest.fn();
    beforeEach(() => {
      store = createConfiguredStore();
      TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
        return (
          <Field
            label="TEST LABEL"
            name="testDropdownID"
            data-test="testDropdown"
            input={{
              value: { label: "Birbs", value: "Birbs" },
              onChange: onChangeSpy
            }}
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

      autocomplete = wrapper
        .find('[data-test="testDropdown"]')
        .first()
        .find("ForwardRef(Autocomplete)");
    });
    test("should add 'Create tag' option for new tags", () => {
      const props = autocomplete.props();

      expect(props.options[0].label).toContain('Create "Birbs"');
    });

    test("should add new tag with correct label and value", () => {
      selectCreatableDropdownOption(
        wrapper,
        '[data-test="testDropdown"]',
        'Create "Birbs"'
      );

      expect(onChangeSpy).toHaveBeenCalledWith({
        label: "Birbs",
        value: "Birbs"
      });
    });
  });

  describe("should display and select previously created tags", () => {
    let onChangeSpy;
    beforeEach(() => {
      store = createConfiguredStore();
      onChangeSpy = jest.fn();
      TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
        return (
          <Field
            label="TEST LABEL"
            name="testDropdownID"
            data-test="testDropdown"
            input={{
              value: { label: "label 2", value: 2 },
              onChange: onChangeSpy
            }}
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
      autocomplete = wrapper
        .find('[data-test="testDropdown"]')
        .first()
        .find("ForwardRef(Autocomplete)")
        .props().options;

      expect(autocomplete.length).toEqual(2);
    });

    test("value passed in should be value of drop down", () => {
      autocomplete = wrapper
        .find('[data-test="testDropdown"]')
        .first()
        .find("ForwardRef(Autocomplete)")
        .props();

      expect(autocomplete.inputValue).toEqual("label 2");
    });

    test("ensure input.onChange is happening on dropdown selection", () => {
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

    test("should return option label when typing a new option", () => {
      changeCreatableDropdownInput(
        wrapper,
        '[data-test="testDropdown"]',
        "label 3"
      );
      expect(onChangeSpy).toHaveBeenCalledWith({
        label: "label 3",
        value: "label 3"
      });
    });

    test("should return 'Create' when clicking on option 'Create 'Create'' ", () => {
      children = [
        { value: 'Create "Create"', label: 'Create "Create"' },
        ...children
      ];
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
        'Create "Create"'
      );

      expect(onChangeSpy).toHaveBeenCalledWith({
        label: "Create",
        value: "Create"
      });
    });
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
