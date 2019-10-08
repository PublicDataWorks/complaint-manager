import createConfiguredStore from "../../../createConfiguredStore";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import Classifications from "./Classifications";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import React from "react";
import { Field } from "redux-form";

describe("Classifications", () => {
  let store, wrapper;
  beforeEach(() => {
    store = createConfiguredStore();
    wrapper = mount(
      <Provider store={store}>
        <Classifications/>
      </Provider>
    )
  });

  test("shows checkboxes with copy", () => {
    expect(wrapper.find('[data-test="Use of Force"]').exists()).toBeTrue();
  });
});
