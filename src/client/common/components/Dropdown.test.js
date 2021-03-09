import React from "react";
import Dropdown, { getSelectedOption } from "./Dropdown";
import createConfiguredStore from "../../createConfiguredStore";
import { Field, reduxForm } from "redux-form";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";
import { selectDropdownOption } from "../../testHelpers";

const children = [
  { label: "label 1", value: 1 },
  { label: "label 2", value: 2 }
];
describe("Dropdown test", () => {
  let store, wrapper, TestForm;
  beforeEach(() => {
    store = createConfiguredStore();

    TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
      return (
        <Field
          label="TEST LABEL"
          name="testDropdownID"
          data-testid="testDropdown"
          input={{ value: 2 }}
          component={Dropdown}
          inputProps={{
            disabled: false
          }}
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
      .find('[data-testid="testDropdown"]')
      .first()
      .find("ForwardRef(Autocomplete)")
      .props().options;

    expect(autocomplete.length).toEqual(2);
  });

  test("value passed in should be value of drop down", () => {
    const autocomplete = wrapper
      .find('[data-testid="testDropdown"]')
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
          data-testid="testDropdown"
          input={{ onChange: onChangeSpy }}
          component={Dropdown}
          inputProps={{
            disabled: false
          }}
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

    selectDropdownOption(wrapper, '[data-testid="testDropdown"]', "label 1");

    expect(onChangeSpy).toHaveBeenCalledWith(1);
  });

  describe("getSelectedOption test", () => {
    test("should return existing option when given an input that is an existing option", () => {
      const props = {
        input: {
          value: 2,
          label: "label 2"
        }
      };
      const selectedValue = getSelectedOption(props.input.value, children);

      expect(selectedValue).toEqual({ label: "label 2", value: 2 });
    });

    test("should return empty option when given an input that is new input", () => {
      const props = {
        input: {
          value: "New string"
        }
      };
      const selectedValue = getSelectedOption(props.input.value, children);

      expect(selectedValue).toEqual({ label: "", value: "" });
    });
  });
});
