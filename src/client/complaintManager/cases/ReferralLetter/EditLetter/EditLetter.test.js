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
import EditLetter from "./EditLetter";
import editReferralLetterContent from "../thunks/editReferralLetterContent";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";

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

describe("Edit Letter Html", () => {
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
        transcribedBy: "joe"
      })
    );
    store.dispatch(
      getCaseDetailsSuccess({ status: CASE_STATUS.LETTER_IN_PROGRESS })
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
    expect(dispatchSpy).toHaveBeenCalledWith(getReferralLetterPreview(caseId));

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

  describe("Saves and Redirects when click Stepper Buttons", function() {
    test("it dispatches edit and redirects to review letter when click review case details stepper button", () => {
      dispatchSpy.mockClear();
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Review Case Details"]')
        .first();
      reviewCaseDetailsButton.simulate("click");

      const expectedFormValues = { editedLetterHtml: initialLetterHtml };
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterContent(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/review`
        )
      );
    });

    test("it dispatches edit and redirects to officer history when click officer history stepper button", () => {
      dispatchSpy.mockClear();
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Officer Complaint Histories"]')
        .first();
      reviewCaseDetailsButton.simulate("click");

      const expectedFormValues = { editedLetterHtml: initialLetterHtml };
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterContent(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/officer-history`
        )
      );
    });

    test("it dispatches edit and redirects to iapro corrections when click iapro corrections stepper button", () => {
      dispatchSpy.mockClear();
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-IAPro Corrections"]')
        .first();
      reviewCaseDetailsButton.simulate("click");

      const expectedFormValues = { editedLetterHtml: initialLetterHtml };
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterContent(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/iapro-corrections`
        )
      );
    });

    test("it dispatches edit and redirects to recommended actions when click recommended actions stepper button", () => {
      dispatchSpy.mockClear();
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Recommended Actions"]')
        .first();
      reviewCaseDetailsButton.simulate("click");

      const expectedFormValues = { editedLetterHtml: initialLetterHtml };
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterContent(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/recommended-actions`
        )
      );
    });

    test("it dispatches edit and redirects to preview when click preview stepper button", () => {
      dispatchSpy.mockClear();
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Preview"]')
        .first();
      reviewCaseDetailsButton.simulate("click");

      const expectedFormValues = { editedLetterHtml: initialLetterHtml };
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
      expect(dispatchSpy).toHaveBeenCalledWith(
        invalidCaseStatusRedirect(caseId)
      );
    });

    test("does not redirect on invalid status if haven't fetched status yet", () => {
      store.dispatch(getCaseDetailsSuccess({ status: null }));
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        invalidCaseStatusRedirect(caseId)
      );
    });
  });
});
