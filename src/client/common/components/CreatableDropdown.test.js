import React from "react";
import Dropdown, { getSelectedOption } from "./Dropdown";
import createConfiguredStore from "../../createConfiguredStore";
import { Field, reduxForm } from "redux-form";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";

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
          data-test="testDropdown"
          component={Dropdown}
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
      .props().children;

    expect(autocomplete.length).toEqual(2);
  });

  test("value passed in should be value of drop down", () => {
    TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
      return (
        <Field
          label="TEST LABEL"
          name="testDropdownID"
          data-test="testDropdown"
          input={{ value: 2 }}
          component={Dropdown}
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
    // allows simulated clicks on Material UI Autocomplete options
    // see documentation here: https://github.com/mui-org/material-ui/issues/15726
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document
      }
    });

    const onChangeSpy = jest.fn();
    TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
      return (
        <Field
          label="TEST LABEL"
          name="testDropdownID"
          data-test="testDropdown"
          input={{ onChange: onChangeSpy }}
          component={Dropdown}
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

    wrapper
      .find('[data-test="testDropdown"]')
      .first()
      .find("ForwardRef(Autocomplete)")
      .find("ForwardRef(IconButton)")
      .last()
      .simulate("click");

    wrapper
      .find("ForwardRef(Portal)")
      .find("[id$='option-0']")
      .simulate("click");

    expect(onChangeSpy).toHaveBeenCalledWith(1);
  });

  test("getSelectedOption should return existing option when given an input that is an existing option and freeSolo is false", () => {
    const props = {
      input: {
        value: 2,
        label: "label 2"
      }
    };
    const selectedValue = getSelectedOption(props.input.value, children, false);

    expect(selectedValue).toEqual({ label: "label 2", value: 2 });
  });

  test("getSelectedOption should return existing option when given an existing input and freeSolo is true", () => {
    const props = {
      input: {
        value: 2
      }
    };
    const selectedValue = getSelectedOption(props.input.value, children, true);

    expect(selectedValue).toEqual({ label: "label 2", value: 2 });
  });

  test("getSelectedOption should return empty option when given an input that is new input and freeSolo is false", () => {
    const props = {
      input: {
        value: "New string"
      }
    };
    const selectedValue = getSelectedOption(props.input.value, children, false);

    expect(selectedValue).toEqual({ label: "", value: "" });
  });

  test("getSelectedOption should return a new object given an input that is not already an existing option and freesolo is true", () => {
    const props = {
      input: {
        value: "New string"
      }
    };
    const selectedValue = getSelectedOption(props.input.value, children, true);

    expect(selectedValue).toEqual({ label: "New string", value: "New string" });
  });
});
