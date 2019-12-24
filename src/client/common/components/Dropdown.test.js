import React from "react";
import Dropdown, { getSelectedValue } from "./Dropdown";
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
  test("getSelectedValue should return object containing option when provided the value", () => {
    const props = {
      input: {
        value: 2
      }
    };
    const selectedValue = getSelectedValue(props.input, children);

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
          component={Dropdown}
          open={true}
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

    const autocomplete = wrapper
      .find('[data-test="testDropdown"]')
      .first()
      .find("ForwardRef(TextField)");

    console.log("Select ", autocomplete.debug());
    console.log("children", children);

    //TODO: get menu to open so we can read contents inside

    expect(autocomplete.length).toEqual(2);
  });
});
