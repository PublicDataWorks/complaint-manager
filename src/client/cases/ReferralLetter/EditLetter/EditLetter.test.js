import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import {
  getLetterPreviewSuccess,
  openCancelEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import getLetterPreview from "../thunks/getLetterPreview";
import EditLetter from "./EditLetter";
import editReferralLetterContent from "../thunks/editReferralLetterContent";

require("../../../testUtilities/MockMutationObserver");

jest.mock("../thunks/getLetterPreview", () => () => ({ type: "" }));

jest.mock(
  "../thunks/editReferralLetterContent",
  (caseId, referralLetterHtml, url) => () => ({ type: "" })
);

describe("Edit Letter Html", () => {
  let store, dispatchSpy, wrapper;

  const caseId = "102";
  const initialLetterHtml = "<p>Letter Preview HTML</p>";

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getLetterPreviewSuccess(initialLetterHtml, {
        sender: "bob",
        recipient: "jane",
        transcribedBy: "joe"
      })
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("load letter preview html and set it on the rtf editor when page is loaded", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getLetterPreview(caseId));

    const rtfEditor = wrapper.find("Quill").first();
    expect(rtfEditor.props().value).toEqual(initialLetterHtml);
  });

  test("dispatch openCancelEditLetterConfirmationDialog when clicking cancel button", () => {
    const cancelButton = wrapper.find("[data-test='cancel-button']").first();
    cancelButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );
  });

  test("open Cancel Edit Letter Confirmation Dialog", () => {
    const cancelButton = wrapper.find("[data-test='cancel-button']").first();
    cancelButton.simulate("click");

    const cancelEditLetterDialog = wrapper
      .find("[data-test='cancel-edit-letter-dialog']")
      .first();
    expect(cancelEditLetterDialog.length).toEqual(1);
  });

  test("dispatch to editReferralLetterContent when clicking save button", () => {
    const saveButton = wrapper.find("[data-test='save-button']").first();
    saveButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterContent(
        caseId,
        initialLetterHtml,
        `/cases/${caseId}/letter/letter-preview`
      )
    );
  });
});
