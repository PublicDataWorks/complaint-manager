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
  let store, wrapper, TestForm, autocomplete, dispatchSpy, autocompleteProps;

  describe("dropdown behavior on typing", () => {
    beforeEach(() => {
      store = createConfiguredStore();
      dispatchSpy = jest.spyOn(store, "dispatch");
      TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
        return (
          <Field
            label="TEST LABEL"
            name="testDropdownID"
            data-testid="testDropdown"
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
        .find('[data-testid="testDropdown"]')
        .first()
        .find("ForwardRef(Autocomplete)");
    });

    test("should create menuItems from options array", () => {
      autocompleteProps = autocomplete.props();

      expect(autocompleteProps.options.length).toEqual(2);
    });

    test("should add new tag with correct label and value", () => {
      changeCreatableDropdownInput(
        wrapper,
        '[data-testid="testDropdown"]',
        "Birbs"
      );

      selectCreatableDropdownOption(
        wrapper,
        '[data-testid="testDropdown"]',
        'Create "Birbs"'
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "@@redux-form/CHANGE",
          payload: {
            label: "Birbs",
            value: "Birbs"
          }
        })
      );
    });
    test("string typed should be value of dropdown", () => {
      changeCreatableDropdownInput(
        wrapper,
        '[data-testid="testDropdown"]',
        "a new string"
      );
      autocompleteProps = wrapper
        .find('[data-testid="testDropdown"]')
        .first()
        .find("ForwardRef(Autocomplete)")
        .props();

      expect(autocompleteProps.inputValue).toEqual("a new string");
    });
    test("should add 'Create tag' option for new tags", () => {
      changeCreatableDropdownInput(
        wrapper,
        '[data-testid="testDropdown"]',
        "Birbs"
      );
      autocompleteProps = wrapper
        .find('[data-testid="testDropdown"]')
        .first()
        .find("ForwardRef(Autocomplete)")
        .props();

      expect(autocompleteProps.options[0].label).toContain('Create "Birbs"');
    });
  });

  describe("dropdown behavior on selection", () => {
    let onChangeSpy;
    beforeEach(() => {
      store = createConfiguredStore();
      onChangeSpy = jest.fn();
      children = [
        { value: 'Create "Create"', label: 'Create "Create"' },
        ...children
      ];
      TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
        return (
          <Field
            label="TEST LABEL"
            name="testDropdownID"
            data-testid="testDropdown"
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
    });

    test("ensure input.onChange is happening on dropdown selection", () => {
      selectCreatableDropdownOption(
        wrapper,
        '[data-testid="testDropdown"]',
        "label 1"
      );

      expect(onChangeSpy).toHaveBeenCalledWith({ label: "label 1", value: 1 });
    });
    test("should return 'Create' when clicking on option 'Create 'Create'' ", () => {
      selectCreatableDropdownOption(
        wrapper,
        '[data-testid="testDropdown"]',
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
