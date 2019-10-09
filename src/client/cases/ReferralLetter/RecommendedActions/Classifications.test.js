import createConfiguredStore from "../../../createConfiguredStore";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import Classifications from "./Classifications";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import React from "react";
import { Field } from "redux-form";
import { getClassificationsSuccess } from "../../../actionCreators/letterActionCreators";

describe("Classifications", () => {
  let store, wrapper;
  beforeEach(() => {
    store = createConfiguredStore();
    const classifications = [
      {name: "Use of Force", message: "get outta here"},
      {name: "Criminal Misconduct", message: "get outta here"},
      {name: "Serious Misconduct", message: "get outta here"},
      {name: "Declines to classify", message: "get outta here"}
    ];
    store.dispatch(getClassificationsSuccess(classifications));

    wrapper = mount(
      <Provider store={store}>
        <Classifications/>
      </Provider>
    );
  });

  test("shows checkboxes with correct list of classifications", () => {
    expect(wrapper.find('[label="Use of Force"]').exists()).toBeTrue();
    expect(wrapper.find('[label="Criminal Misconduct"]').exists()).toBeTrue();
    expect(wrapper.find('[label="Serious Misconduct"]').exists()).toBeTrue();
    expect(wrapper.find('[label="Declines to classify"]').exists()).toBeTrue();
  });

  // test("should disable all other checkboxes if 'Declines to Classify' is checked", () => {
  //   const declinesBox = wrapper.find('[name="Declines to classify"]');
  //   declinesBox.simulate("click")
  //
  //   expect(wrapper.find('[name="Use of Force"]').is('[disabled]')).toBeTrue();
  //   // expect(wrapper.find('[name="Criminal Misconduct"]').exists()).toBeTrue();
  //   // expect(wrapper.find('[name="Serious Misconduct"]').exists()).toBeTrue();
  // })
});
