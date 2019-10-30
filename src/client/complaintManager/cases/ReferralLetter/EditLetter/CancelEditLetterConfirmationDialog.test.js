import createConfiguredStore from "../../../../createConfiguredStore";
import {
  closeCancelEditLetterConfirmationDialog,
  openCancelEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme/build";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import CancelEditLetterConfirmationDialog from "./CancelEditLetterConfirmationDialog";
import { push } from "connected-react-router";

describe("Cancel Edit Confirmation Dialog", () => {
  let store, dispatchSpy, wrapper;

  const caseId = 123;

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(openCancelEditLetterConfirmationDialog());

    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CancelEditLetterConfirmationDialog caseId={caseId} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("close the dialog when cancel is clicked", () => {
    const button = wrapper.find("[data-test='continueEditingButton']").first();
    button.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      closeCancelEditLetterConfirmationDialog()
    );
  });

  test("open letter preview page and close the dialog when discard edits is clicked", () => {
    const discardEditsButton = wrapper
      .find("[data-test='discardEditsButton']")
      .first();
    discardEditsButton.simulate("click");

    expect(dispatchSpy).toHaveBeenNthCalledWith(
      1,
      push(`/cases/${caseId}/letter/letter-preview`)
    );
    expect(dispatchSpy).toHaveBeenNthCalledWith(
      2,
      closeCancelEditLetterConfirmationDialog()
    );
  });
});
