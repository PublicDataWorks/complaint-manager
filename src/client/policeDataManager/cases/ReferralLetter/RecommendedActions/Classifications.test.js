import createConfiguredStore from "../../../../createConfiguredStore";
import Classifications from "./Classifications";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import React from "react";
import { getClassificationsSuccess } from "../../../actionCreators/letterActionCreators";

describe("Classifications", () => {
  let store, wrapper;
  beforeEach(() => {
    store = createConfiguredStore();
    const classifications = [
      { name: "Use of Force", message: "get outta here", id: 1 },
      { name: "Criminal Misconduct", message: "get outta here", id: 2 },
      { name: "Serious Misconduct", message: "get outta here", id: 3 },
      { name: "Declines to classify", message: "get outta here", id: 4 }
    ];
    store.dispatch(getClassificationsSuccess(classifications));

    wrapper = mount(
      <Provider store={store}>
        <Classifications
          initialDisabled={false}
          classifications={classifications}
        />
      </Provider>
    );
  });

  test("shows checkboxes with correct list of classifications", () => {
    expect(wrapper.find('[label="Use of Force"]').exists()).toBeTrue();
    expect(wrapper.find('[label="Criminal Misconduct"]').exists()).toBeTrue();
    expect(wrapper.find('[label="Serious Misconduct"]').exists()).toBeTrue();
    expect(wrapper.find('[label="Declines to classify"]').exists()).toBeTrue();
  });

  test("should disable all other checkboxes if 'Declines to Classify' is checked", () => {
    const event = { target: { value: true } };
    const declinesBox = wrapper.find('[label="Declines to classify"]').last();
    declinesBox
      .props()
      .onChange(event, event.target.value, "Declines to classify");

    wrapper.update();

    expect(
      wrapper.find('[label="Use of Force"]').last().props().control.props
        .disabled
    ).toBeTrue();
    expect(
      wrapper.find('[label="Criminal Misconduct"]').last().props().control.props
        .disabled
    ).toBeTrue();
    expect(
      wrapper.find('[label="Serious Misconduct"]').last().props().control.props
        .disabled
    ).toBeTrue();
  });
});
