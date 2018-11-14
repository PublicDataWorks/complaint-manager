import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import LetterPreview from "./LetterPreview";
import {
  getLetterPreviewSuccess,
  openEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";
import { changeInput } from "../../../testHelpers";
import {
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import setCaseStatus from "../../thunks/setCaseStatus";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import generatePdf from "../thunks/generatePdf";

jest.mock(
  "../thunks/editReferralLetterAddresses",
  () => (caseId, values, redirectUrl, alternativeCallback) => {
    if (alternativeCallback) {
      alternativeCallback();
    }
    return {
      type: "SOMETHING",
      caseId,
      values,
      redirectUrl
    };
  }
);

jest.mock("../../thunks/setCaseStatus", () =>
  jest.fn(() => (caseId, status, redirectUrl) => {})
);

jest.mock("../thunks/generatePdf", () => caseId => {
  return {
    type: "SOMETHING",
    caseId
  };
});

describe("LetterPreview", function() {
  let store, dispatchSpy, wrapper, caseId;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = "102";

    store.dispatch(
      getLetterPreviewSuccess(
        "Letter Preview HTML",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        {
          edited: false
        }
      )
    );
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS
      })
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <LetterPreview match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
    dispatchSpy.mockClear();
  });

  test("dispatches editReferralLetterAddresses with correct values for return to case button", () => {
    const button = wrapper
      .find("[data-test='save-and-return-to-case-link']")
      .first();
    button.simulate("click");
    const expectedFormValues = {
      sender: "bob",
      recipient: "jane",
      transcribedBy: "joe"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterAddresses(
        caseId,
        expectedFormValues,
        `/cases/${caseId}`
      )
    );
  });

  test("dispatches editReferralLetterAddresses with correct values for download button", () => {
    const button = wrapper.find("[data-test='download-letter-as-pdf']").first();
    button.simulate("click");
    const expectedFormValues = {
      sender: "bob",
      recipient: "jane",
      transcribedBy: "joe"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterAddresses(caseId, expectedFormValues, null, jest.fn())
    );
  });

  test("dispatches editReferralLetterAddresses with correct values for back button", () => {
    changeInput(wrapper, "[data-test='transcribed-by-field']", "transcriber");
    const backButton = wrapper.find("[data-test='back-button']").first();
    backButton.simulate("click");
    const expectedFormValues = {
      sender: "bob",
      recipient: "jane",
      transcribedBy: "transcriber"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterAddresses(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/recommended-actions`
      )
    );
  });

  test("dispatch openEditLetterConfirmationDialog when clicking edit button if the letter was not edited", () => {
    const editButton = wrapper.find("[data-test='edit-button']").first();
    editButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      openEditLetterConfirmationDialog()
    );
  });

  test("does not render submit for review button when case is not in letter in progress status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.READY_FOR_REVIEW
      })
    );
    wrapper.update();

    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    expect(openSubmitForReviewButton.exists()).toBeFalsy();
  });

  test("dispatch open case status dialog on click of submit for review button", () => {
    dispatchSpy.mockClear();
    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(`/cases/${caseId}`)
    );
  });

  test("editReferralLetterAddresses and setCaseStatus are called when click on confirmation of submit for review dialog", () => {
    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");
    const submitForReviewButton = wrapper
      .find("[data-test='update-case-status-button']")
      .first();
    submitForReviewButton.simulate("click");
    const expectedFormValues = {
      sender: "bob",
      recipient: "jane",
      transcribedBy: "joe"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterAddresses(caseId, expectedFormValues, null, () => {})
    );
    expect(setCaseStatus).toHaveBeenCalled();
  });

  describe("Saves and Redirects when click Stepper Buttons", function() {
    let expectedFormValues;
    beforeEach(function() {
      expectedFormValues = {
        sender: "bob",
        recipient: "jane",
        transcribedBy: "joe"
      };
    });

    test("it dispatches edit and redirects to review letter when click review case details stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Review Case Details"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterAddresses(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/review`
        )
      );
    });

    test("it dispatches edit and redirects to officer history when click officer history stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Officer Complaint Histories"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterAddresses(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/officer-history`
        )
      );
    });

    test("it dispatches edit and redirects to iapro corrections when click iapro corrections stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-IAPro Corrections"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterAddresses(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/iapro-corrections`
        )
      );
    });

    test("it dispatches edit and redirects to recommended actions when click recommended actions stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Recommended Actions"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterAddresses(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/recommended-actions`
        )
      );
    });

    test("it dispatches edit and redirects to preview when click preview stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Preview"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editReferralLetterAddresses(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/letter-preview`
        )
      );
    });
  });
  test("do not dispatch openEditLetterConfirmationDialog when clicking edit button if the letter was edited", () => {
    store.dispatch(
      getLetterPreviewSuccess(
        "Letter Preview HTML Edited",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        { edited: true }
      )
    );

    dispatchSpy.mockClear();
    const editButton = wrapper.find("[data-test='edit-button']").first();
    editButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openEditLetterConfirmationDialog()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterAddresses(
        caseId,
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        `/cases/${caseId}/letter/edit-letter`
      )
    );
  });

  test("dispatches generatePdf when download button is clicked", () => {
    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(generatePdf(caseId));
  });

  test("test that download button has correct text based on edit history", () => {
    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    let expectedText = "Download Generated Letter as PDF File";
    expect(downloadButton.text()).toEqual(expectedText);
    expectedText = "Download Edited Letter as PDF File";
    store.dispatch(
      getLetterPreviewSuccess(
        "Letter Preview HTML Edited",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        { edited: true }
      )
    );
    expect(downloadButton.text()).toEqual(expectedText);
  });
});
