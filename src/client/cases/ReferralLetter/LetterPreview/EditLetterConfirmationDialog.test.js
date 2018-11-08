import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeEditLetterConfirmationDialog,
  openEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme/build";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import EditLetterConfirmationDialog from "./EditLetterConfirmationDialog";

describe("Edit Confirmation Dialog", () => {
  let store, dispatchSpy, wrapper;

  const caseId = 123;
  const mockCallbackFunction = jest.fn();

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(openEditLetterConfirmationDialog());

    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditLetterConfirmationDialog
            caseId={caseId}
            saveAndGoToEditLetterCallback={mockCallbackFunction}
          />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("close the dialog when cancel is clicked", () => {
    const button = wrapper.find("[data-test='cancelButton']").first();
    button.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      closeEditLetterConfirmationDialog()
    );
  });

  test("open edit letter page and close the dialog when edit letter is clicked", () => {
    const editLetterButton = wrapper
      .find("[data-test='editLetterButton']")
      .first();
    editLetterButton.simulate("click");

    expect(mockCallbackFunction).toHaveBeenCalled();

    expect(dispatchSpy).toHaveBeenCalledWith(
      closeEditLetterConfirmationDialog()
    );
  });
});
