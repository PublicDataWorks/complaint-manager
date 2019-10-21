import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import LetterPreview from "./LetterPreview";
import {
  getReferralLetterPreviewSuccess,
  getReferralLetterSuccess,
  openEditLetterConfirmationDialog,
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog,
  startLetterDownload,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";
import { changeInput } from "../../../testHelpers";
import {
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import setCaseStatus from "../../thunks/setCaseStatus";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  EDIT_STATUS,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import getReferralLetterPdf from "../thunks/getReferralLetterPdf";
import { userAuthSuccess } from "../../../auth/actionCreators";
import timekeeper from "timekeeper";
import featureTogglesReducer from "../../../reducers/featureToggles/featureTogglesReducer";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

jest.mock("../thunks/editReferralLetterAddresses", () =>
  jest.fn((caseId, values, redirectUrl, successCallback, failureCallback) => {
    if (successCallback) {
      successCallback();
    }
    return {
      type: "SOMETHING",
      caseId,
      values,
      redirectUrl
    };
  })
);

jest.mock("../../thunks/setCaseStatus", () =>
  jest.fn(() => (caseId, status, redirectUrl) => {})
);

jest.mock(
  "../thunks/getReferralLetterPdf",
  () => (caseId, filename, saveFileForUser) => {
    return {
      type: "SOMETHING",
      caseId,
      filename,
      saveFileForUser
    };
  }
);

describe("LetterPreview", function() {
  const finalFilename = "final_filename.pdf";
  const draftFilename = "draft_filename.pdf";
  const date = new Date("Jan 01 2018 00:00:00 GMT-0600");
  timekeeper.freeze(date);

  let store, dispatchSpy, wrapper, caseId, caseDetail;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = "102";

    caseDetail = {
      id: caseId,
      caseReference: "CC2012-0102",
      firstContactDate: "2012-05-05",
      complaintType: CIVILIAN_INITIATED,
      complainantCivilians: [{ lastName: "Brown" }],
      status: CASE_STATUS.LETTER_IN_PROGRESS
    };

    store.dispatch(
      getReferralLetterPreviewSuccess(
        "Letter Preview HTML",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        EDIT_STATUS.GENERATED,
        null,
        finalFilename,
        draftFilename
      )
    );
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
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
    const editButton = wrapper
      .find("[data-test='edit-confirmation-dialog-button']")
      .first();
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
    store.dispatch(
      getReferralLetterSuccess({
        letterOfficers: [
          {
            fullName: "somebody",
            officerHistoryOptionId: 1
          }
        ],
        classifications: { "csfn-1": true }
      })
    );
    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(
        CASE_STATUS.READY_FOR_REVIEW,
        `/cases/${caseId}`
      )
    );
  });

  test("editReferralLetterAddresses and setCaseStatus are called when click on confirmation of submit for review dialog", () => {
    store.dispatch(
      getReferralLetterSuccess({
        letterOfficers: [
          {
            fullName: "somebody",
            officerHistoryOptionId: 1
          }
        ],
        classifications: { "csfn-1": true }
      })
    );
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

  test("should not render Review and Approve Letter button if not authorized to approve letter and in Ready for Review", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    store.dispatch(
      userAuthSuccess({
        permissions: []
      })
    );

    wrapper.update();
    const reviewAndApproveLetterButton = wrapper
      .find('[data-test="review-and-approve-letter-button"]')
      .first();

    expect(reviewAndApproveLetterButton.exists()).toEqual(false);
  });

  test("should not render Review and Approve Letter button if not in Ready For Review status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
      })
    );

    wrapper.update();
    const reviewAndApproveLetterButton = wrapper
      .find('[data-test="review-and-approve-letter-button"]')
      .first();

    expect(reviewAndApproveLetterButton.exists()).toEqual(false);
  });

  test("should render Review and Approve letter button if authorized and in Ready for Review", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );
    wrapper.update();
    const reviewAndApproveLetterButton = wrapper
      .find('[data-test="review-and-approve-letter-button"]')
      .first();

    expect(reviewAndApproveLetterButton.exists()).toEqual(true);
  });

  test("should not render letter approved message if in letter in progress", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
      })
    );
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );
    wrapper.update();
    const message = wrapper
      .find('[data-test="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-test="letter-preview"]').first();

    expect(message.exists()).toEqual(false);
    expect(preview.exists()).toEqual(true);
  });

  test("should not render letter approved message if in ready for review", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );
    wrapper.update();
    const message = wrapper
      .find('[data-test="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-test="letter-preview"]').first();

    expect(message.exists()).toEqual(false);
    expect(preview.exists()).toEqual(true);
  });
  test("should render letter approved message if in forwarded to agency status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: CASE_STATUS.CLOSED
      })
    );
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );
    wrapper.update();
    const message = wrapper
      .find('[data-test="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-test="letter-preview"]').first();

    expect(message.exists()).toEqual(true);
    expect(preview.exists()).toEqual(false);
  });

  test("should not see edit letter button when letter has been approved", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.CLOSED,
        nextStatus: null
      })
    );

    wrapper.update();

    const editLetterButton = wrapper
      .find('[data-test="edit-confirmation-dialog-button"]')
      .first();

    expect(editLetterButton.exists()).toEqual(false);
  });

  test("should see edit letter button when letter is in progress", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        nextStatus: null
      })
    );

    wrapper.update();

    const editLetterButton = wrapper
      .find('[data-test="edit-confirmation-dialog-button"]')
      .first();

    expect(editLetterButton.exists()).toEqual(true);
  });

  test("should render back button when letter has been approved", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.CLOSED,
        nextStatus: null
      })
    );

    wrapper.update();
    const backButton = wrapper.find('[data-test="back-button"]').first();
    expect(backButton.exists()).toEqual(true);
  });

  test("should render letter approved message if in closed status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.CLOSED,
        nextStatus: null
      })
    );
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );
    wrapper.update();
    const message = wrapper
      .find('[data-test="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-test="letter-preview"]').first();

    expect(message.exists()).toEqual(true);
    expect(preview.exists()).toEqual(false);
  });

  test("dispatches editReferralLetterAddresses with correct values for back button", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );
    changeInput(wrapper, "[data-test='transcribed-by-field']", "transcriber");
    const reviewAndApproveButton = wrapper
      .find("[data-test='review-and-approve-letter-button']")
      .first();
    dispatchSpy.mockClear();
    reviewAndApproveButton.simulate("click");
    const expectedFormValues = {
      sender: "bob",
      recipient: "jane",
      transcribedBy: "transcriber"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterAddresses(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/review-and-approve`
      )
    );
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
      getReferralLetterPreviewSuccess(
        "Letter Preview HTML Edited",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        EDIT_STATUS.EDITED,
        date,
        finalFilename,
        draftFilename
      )
    );

    dispatchSpy.mockClear();
    const editButton = wrapper
      .find("[data-test='edit-confirmation-dialog-button']")
      .first();
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

  test("dispatches startLetterDownload and getReferralLetterPdf with edit info when download button is clicked and pdf has been edited", () => {
    store.dispatch(
      getReferralLetterPreviewSuccess(
        "Letter Preview HTML",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        EDIT_STATUS.EDITED,
        date,
        finalFilename,
        draftFilename
      )
    );

    store.dispatch(getCaseDetailsSuccess(caseDetail));
    dispatchSpy.mockClear();

    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(startLetterDownload());
    expect(dispatchSpy).toHaveBeenCalledWith(
      getReferralLetterPdf(caseId, draftFilename, true)
    );
  });

  test("dispatches startLetterDownload and getReferralLetterPdf with edit info when download button is clicked and pdf is unedited", () => {
    store.dispatch(getCaseDetailsSuccess(caseDetail));
    dispatchSpy.mockClear();
    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(startLetterDownload());
    expect(dispatchSpy).toHaveBeenNthCalledWith(
      3,
      getReferralLetterPdf(caseId, draftFilename, true)
    );
  });

  test("dispatches stopLetterDownload on failure of download letter", () => {
    editReferralLetterAddresses.mockImplementationOnce(
      (caseId, values, redirectUrl, successCallback, failureCallback) => {
        failureCallback();
        return {
          type: "SOMETHING",
          caseId,
          values,
          redirectUrl
        };
      }
    );

    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(stopLetterDownload());
  });

  test("test that download button has correct text based on edit history", () => {
    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    let expectedText = "Download Generated Letter as PDF File";
    expect(downloadButton.text()).toEqual(expectedText);
    expectedText = "Download Edited Letter as PDF File";
    store.dispatch(
      getReferralLetterPreviewSuccess(
        "Letter Preview HTML Edited",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        EDIT_STATUS.EDITED,
        date,
        finalFilename,
        draftFilename
      )
    );
    expect(downloadButton.text()).toEqual(expectedText);
  });

  test("test that download button is disabled and progress indicator is visible when download is in progress", () => {
    let downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    wrapper.update();
    const progressIndicator = wrapper
      .find('[data-test="download-letter-progress"]')
      .first();
    downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();
    expect(downloadButton.props().disabled).toBeTruthy();
    expect(progressIndicator.props().style.display).toEqual("");
  });

  test("test that download button is enabled and progress indicator is not visible by default", () => {
    const downloadButton = wrapper
      .find('[data-test="download-letter-as-pdf"]')
      .first();

    const progressIndicator = wrapper
      .find('[data-test="download-letter-progress"]')
      .first();
    expect(downloadButton.props().disabled).toBeFalsy();
    expect(progressIndicator.props().style.display).toEqual("none");
  });

  test("should call incomplete officer history modal when accused officer is missing officer history", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getReferralLetterSuccess({
        letterOfficers: [
          {
            fullName: "somebody",
            officerHistoryOptionId: null
          }
        ]
      })
    );
    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openIncompleteOfficerHistoryDialog(expect.anything())
    );
  });

  test("should call missing classifications modal when no classifications are selected", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getReferralLetterSuccess({
        letterOfficers: [
          {
            fullName: "somebody",
            officerHistoryOptionId: 2
          }
        ],
        classifications: {}
      })
    );
    store.dispatch(getFeaturesSuccess({ classificationFeature: true }));
    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openIncompleteClassificationsDialog(expect.anything())
    );
  });

  test("should call incomplete officer history dialog if both classifications and officer history are missing", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getReferralLetterSuccess({
        letterOfficers: [
          {
            fullName: "somebody",
            officerHistoryOptionId: null
          }
        ],
        classifications: {}
      })
    );
    const openSubmitForReviewButton = wrapper
      .find("[data-test='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openIncompleteOfficerHistoryDialog(expect.anything())
    );
  });
});
