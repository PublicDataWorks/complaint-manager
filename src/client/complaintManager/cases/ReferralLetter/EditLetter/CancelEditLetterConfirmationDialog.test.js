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
  let store, dispatchSpy, wrapper, unblock;

  const caseId = 123;

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(openCancelEditLetterConfirmationDialog());

    dispatchSpy = jest.spyOn(store, "dispatch");
    unblock = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CancelEditLetterConfirmationDialog
            caseId={caseId}
            unblock={unblock}
            redirectUrl={"/cases/123/letter/letter-preview"}
          />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("close the dialog when cancel is clicked", () => {
    const button = wrapper
      .find("[data-testid='continueEditingButton']")
      .first();
    button.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      closeCancelEditLetterConfirmationDialog()
    );
  });

  test("open redirectURL and close the dialog when discard edits is clicked", () => {
    const discardEditsButton = wrapper
      .find("[data-testid='discardEditsButton']")
      .first();
    discardEditsButton.simulate("click");

    expect(unblock).toHaveBeenCalledWith(false);

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
