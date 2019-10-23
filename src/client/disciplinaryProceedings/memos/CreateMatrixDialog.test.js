import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import React from "react";
import CreateMatrixButton from "./CreateMatrixButton";
import { expectEventuallyNotToExist } from "../../testHelpers";

describe("CreateMatrixDialog", () => {
  let store, wrapper, dispatchSpy;

  beforeEach(() => {
    store = createConfiguredStore();

    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <CreateMatrixButton />
      </Provider>
    );

    dispatchSpy.mockClear();

    const createMatrixDialog = wrapper.find(
      'button[data-test="create-matrix-button"]'
    );
    createMatrixDialog.simulate("click");
  });

  test("should dismiss when cancel button is clicked", async () => {
    const cancel = wrapper.find('button[data-test="cancel-matrix"]');
    cancel.simulate("click");

    await expectEventuallyNotToExist(
      wrapper,
      '[data-test="create-matrix-dialog-title"]'
    );
  });
});
