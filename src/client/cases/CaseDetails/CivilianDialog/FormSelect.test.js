import React from "react";
import NoBlurTextField, {
  getOptionsIfEnabled,
  getSelectedValue
} from "./FormSelect";
import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";

const children = [
  { label: "label 1", value: 1 },
  { label: "label 2", value: 2 }
];

describe("FormSelect test", () => {
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
          component={NoBlurTextField}
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

    const menuItem = wrapper
      .find('[data-test="testDropdown"]')
      .first()
      .find("MenuItem");

    expect(menuItem.length).toEqual(2);
  });
});
