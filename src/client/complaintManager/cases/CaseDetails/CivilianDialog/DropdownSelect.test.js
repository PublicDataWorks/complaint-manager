import React from "react";
import DropdownSelect, {
  getOptionsIfEnabled,
  getSelectedValue
} from "./DropdownSelect";
import createConfiguredStore from "../../../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";

const children = [
  { label: "label 1", value: 1 },
  { label: "label 2", value: 2 }
];

describe("DropdownSelect test", () => {
  test("should not load menu if disabled", () => {
    const custom = { disabled: true };
    const options = getOptionsIfEnabled(custom, children);

    expect(options).toEqual([]);
  });

  test("getSelectedValue should return object containing option when provided the value", () => {
    const props = {
      input: {
        value: 2
      }
    };
    const selectedValue = getSelectedValue(props, children);

    expect(selectedValue).toEqual({ label: "label 2", value: 2 });
  });

  test("should create menuItems from options array", () => {
    const store = createConfiguredStore();

    const TestForm = reduxForm({ form: "testMenuItemsForm" })(() => {
      return (
        <Field
          label="TEST LABEL"
          name="testDropdownID"
          data-test="testDropdown"
          component={DropdownSelect}
          menuIsOpen={true}
        >
          {children}
        </Field>
      );
    });

    const wrapper = mount(
      <Provider store={store}>
        <Dialog open={true}>
          <DialogContent>
            <TestForm />
          </DialogContent>
        </Dialog>
      </Provider>
    );

    const selectContainer = wrapper
      .find('[data-test="testDropdown"]')
      .first()
      .find("SelectContainer");

    expect(selectContainer.length).toEqual(2);
  });
});
