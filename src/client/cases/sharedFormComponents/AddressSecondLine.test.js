import AddressSecondLine from "./AddressSecondLine";
import React from "react";
import { mount } from "enzyme";
import { reduxForm } from "redux-form";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import { containsText } from "../../testHelpers";

describe("AddressSecondLine", () => {
  test("should render a custom label", () => {
    const AddressForm = reduxForm({ form: "testAddressForm" })(() => {
      return <AddressSecondLine fieldName="test" label="TEST LABEL" />;
    });

    const store = createConfiguredStore();
    const wrapper = mount(
      <Provider store={store}>
        <AddressForm />
      </Provider>
    );

    containsText(wrapper, '[data-test="streetAddress2Field"]', "TEST LABEL");
  });
});
