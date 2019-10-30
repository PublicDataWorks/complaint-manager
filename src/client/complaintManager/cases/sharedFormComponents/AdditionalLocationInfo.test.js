import React from "react";
import { reduxForm } from "redux-form";
import createConfiguredStore from "../../../createConfiguredStore";
import { containsText } from "../../../testHelpers";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import AdditionalLocationInfo from "./AdditionalLocationInfo";

describe("AdditionalLocationInfo", function() {
  test("should render a custom label", () => {
    const addressLabel = "TEST ADDITIONAL LOCATION INFO LABEL";
    const AddressForm = reduxForm({ form: "testAddressForm" })(() => {
      return <AdditionalLocationInfo fieldName="test" label={addressLabel} />;
    });

    const store = createConfiguredStore();
    const wrapper = mount(
      <Provider store={store}>
        <AddressForm />
      </Provider>
    );

    containsText(wrapper, '[data-test="additionalLocationInfo"]', addressLabel);
  });
});
