import createConfiguredStore from "../../../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import {
  getReferralLetterPreviewSuccess,
  openCancelEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import EditReferralLetter from "./EditReferralLetter";
import editReferralLetterContent from "../thunks/editReferralLetterContent";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  EDIT_LETTER_HTML_FORM
} from "../../../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { push } from "connected-react-router";
import history from "../../../../history";
import { initialize } from "redux-form";
import { Card } from "@material-ui/core";

require("../../../testUtilities/MockMutationObserver");

jest.mock("../thunks/getReferralLetterPreview", () => () => ({
  type: "getReferralLetterPreview"
}));

jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "invalidCaseStatusRedirect",
  caseId
}));

jest.mock(
  "../thunks/editReferralLetterContent",
  () => (caseId, referralLetterHtml, url) => ({
    type: "editReferralLetterContent",
    caseId,
    referralLetterHtml,
    url
  })
);

describe("Edit Referral Letter Html", () => {
  let store, dispatchSpy, wrapper;

  const caseId = "102";
  const initialLetterHtml = "<p>Letter Preview HTML</p>";

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getReferralLetterPreviewSuccess(initialLetterHtml, {
        sender: "bob",
        recipient: "jane",
        recipientAddress: "jane's address",
        transcribedBy: "joe"
      })
    );
    store.dispatch(
      getCaseDetailsSuccess({
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        caseReference: "ABC-123-that'showeasylovecanbe"
      })
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditReferralLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("load letter preview html and set it on the quill editor when page is loaded", () => {
    store.dispatch(
      initialize(EDIT_LETTER_HTML_FORM, { editedLetterHtml: initialLetterHtml })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(getReferralLetterPreview(caseId));

    wrapper.update();

    const quillEditor = wrapper.find("Quill").first();
    expect(quillEditor.props().value).toEqual(initialLetterHtml);
  });

  test("dispatch openCancelEditLetterConfirmationDialog when clicking cancel button only when letter is 'dirty'", () => {
    const cancelButton = wrapper.find("[data-testid='cancel-button']").first();
    cancelButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );

    const input = wrapper.find("Quill").first();
    input.props().onChange("testing");

    wrapper.update();

    cancelButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );
    const cancelEditLetterDialog = wrapper
      .find("[data-testid='cancel-edit-letter-dialog']")
      .first();
    expect(cancelEditLetterDialog.length).toEqual(1);
  });

  test("should redirect to letter-preview when clicking cancel button on 'pristine' letter", () => {
    const cancelButton = wrapper.find("[data-testid='cancel-button']").first();
    cancelButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/letter/letter-preview`)
    );
  });

  test("dispatch openCancelEditLetterConfirmationDialog and do not save edits when clicking any stepper button only when letter is 'dirty'", () => {
    const statusStepper = wrapper
      .find("[data-testid='step-button-Review Case Details']")
      .first();
    statusStepper.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/letter/review`)
    );

    const input = wrapper.find("Quill").first();
    input.props().onChange("testing");

    wrapper.update();

    statusStepper.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );
  });

  test("dispatch openCancelEditLetterConfirmationDialog and not save edits when clicking back to case button only when letter is 'dirty'", () => {
    const backToCaseButton = wrapper
      .find("[data-testid='save-and-return-to-case-link']")
      .first();
    backToCaseButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));

    const input = wrapper.find("Quill").first();
    input.props().onChange("testing");

    wrapper.update();

    backToCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );
  });

  test("dispatch openCancelEditLetterConfirmationDialog and not save edits when clicking nav bar buttons", () => {
    history.push("/");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    const input = wrapper.find("Quill").first();
    input.props().onChange("testing");
    wrapper.update();

    history.push("/");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );
  });

  test("dispatch openCancelEditLetterConfirmationDialog and not save edits when clicking logout", () => {
    history.push("/logout");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    const input = wrapper.find("Quill").first();
    input.props().onChange("testing");
    wrapper.update();

    history.push("/logout");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCancelEditLetterConfirmationDialog()
    );
  });

  test("does not dispatch openCancelEditLetterConfirmationDialog and saves edits when clicking save button", () => {
    console.warn = () => {};
    const input = wrapper.find("Quill").first();
    input.props().onChange("<p>Letter Preview HTML change </p>");

    const saveButton = wrapper.find("[data-testid='save-button']").first();
    saveButton.simulate("click");

    const expectedFormValues = {
      editedLetterHtml: "<p>Letter Preview HTML change</p>"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterContent(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/letter-preview`
      )
    );
  });

  test("redirects to case details page if not in a valid status", () => {
    store.dispatch(
      getCaseDetailsSuccess({ status: CASE_STATUS.FORWARDED_TO_AGENCY })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
  });

  test("does not redirect on invalid status if haven't fetched status yet", () => {
    store.dispatch(getCaseDetailsSuccess({ status: null }));
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      invalidCaseStatusRedirect(caseId)
    );
  });
});
