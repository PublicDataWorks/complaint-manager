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
  let store, dispatchSpy, wrapper, shouldBlockRoutingRedirects, closeDialog;

  const caseId = 123;

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(openCancelEditLetterConfirmationDialog());

    dispatchSpy = jest.spyOn(store, "dispatch");
    shouldBlockRoutingRedirects = jest.fn();
    closeDialog = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CancelEditLetterConfirmationDialog
            caseId={caseId}
            shouldBlockRoutingRedirects={shouldBlockRoutingRedirects}
            redirectUrl={"/cases/123/letter/letter-preview"}
            open={true}
            closeDialog={closeDialog}
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

    expect(closeDialog).toHaveBeenCalled();
  });

  test("open redirectURL and close the dialog when discard edits is clicked", () => {
    const discardEditsButton = wrapper
      .find("[data-testid='discardEditsButton']")
      .first();
    discardEditsButton.simulate("click");

    expect(shouldBlockRoutingRedirects).toHaveBeenCalledWith(false);

    expect(dispatchSpy).toHaveBeenNthCalledWith(
      1,
      push(`/cases/${caseId}/letter/letter-preview`)
    );
    expect(closeDialog).toHaveBeenCalled();
  });
});
