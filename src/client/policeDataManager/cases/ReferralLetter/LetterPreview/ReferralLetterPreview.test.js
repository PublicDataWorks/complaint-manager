import createConfiguredStore from "../../../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import {
  getReferralLetterPreviewSuccess,
  getReferralLetterSuccess,
  openEditLetterConfirmationDialog,
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog,
  openMissingComplainantDialog,
  startLetterDownload
} from "../../../actionCreators/letterActionCreators";
import { changeInput } from "../../../../testHelpers";
import {
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  EDIT_STATUS,
  GET_FEATURES_SUCCEEDED,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";
import timekeeper from "timekeeper";
import ReferralLetterPreview from "./ReferralLetterPreview";
import nock from "nock";
import { push } from "connected-react-router";
import { LetterPreview } from "./LetterPreview";

jest.mock("../../thunks/setCaseStatus", () =>
  jest.fn(() => (caseId, status, redirectUrl) => {})
);

jest.mock(
  "../thunks/getLetterPdf",
  () => (caseId, filename, saveFileForUser) => {
    return {
      type: "SOMETHING",
      caseId,
      filename,
      saveFileForUser
    };
  }
);

jest.mock("../../UserAvatar", () => {
  return {
    __esModule: true,
    default: () => {
      return <div />;
    }
  };
});

describe("ReferralLetterPreview", function () {
  jest.setTimeout(3000);
  const finalFilename = "final_filename.pdf";
  const draftFilename = "draft_filename.pdf";
  const date = new Date("Jan 01 2018 00:00:00 GMT-0600");
  timekeeper.freeze(date);

  let store, dispatchSpy, wrapper, caseId, caseDetail, submitSpy;
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
          recipientAddress: "jane's address",
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

    store.dispatch({
      type: GET_FEATURES_SUCCEEDED,
      features: {
        allowAccusedOfficersToBeBlankFeature: false
      }
    });

    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.SETUP_LETTER] }
    });

    submitSpy?.mockClear();
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ReferralLetterPreview match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );

    submitSpy = jest.spyOn(
      wrapper.find(LetterPreview).instance(),
      "submitForm"
    );

    dispatchSpy.mockClear();

    nock("http://localhost")
      .put(`/api/cases/${caseId}/referral-letter/addresses`)
      .reply(200, {});
  });

  test("calls edit referral letter addresses handler with correct values for return to case button", () => {
    const button = wrapper
      .find("[data-testid='save-and-return-to-case-link']")
      .first();
    button.simulate("click");
    expect(submitSpy).toHaveBeenCalledWith(`/cases/${caseId}`);
  });

  test("calls edit referral letter addresses with correct values for download button", () => {
    const button = wrapper
      .find("[data-testid='download-letter-as-pdf']")
      .first();
    button.simulate("click");
    expect(submitSpy).toHaveBeenCalledWith(
      null,
      wrapper.find(LetterPreview).instance().downloadLetterAsPdfFile,
      expect.anything()
    );
  });

  test("calls edit referral letter addresses with correct values for review and approve button button", done => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: [],
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );

    changeInput(wrapper, "[data-testid='transcribed-by-field']", "transcriber");

    const reviewAndApproveButton = wrapper
      .find("[data-testid='review-and-approve-letter-button']")
      .first();

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

    dispatchSpy.mockClear();
    reviewAndApproveButton.simulate("click");

    setTimeout(() => {
      expect(
        dispatchSpy.mock.calls.find(
          call => call[0].type === "@@router/CALL_HISTORY_METHOD"
        )[0]
      ).toEqual(push(`/cases/${caseId}/letter/review-and-approve`));
      done();
    }, 1000);
  });

  test("dispatch openEditLetterConfirmationDialog when clicking edit button if the letter was not edited", () => {
    const editButton = wrapper
      .find("[data-testid='edit-confirmation-dialog-button']")
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
      .find("[data-testid='submit-for-review-button']")
      .first();
    expect(openSubmitForReviewButton.exists()).toBeFalsy();
  });

  test("dispatch open case status dialog on click of submit for review button", async () => {
    dispatchSpy.mockClear();

    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: [],
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
      })
    );

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
      .find("[data-testid='submit-for-review-button']")
      .first();

    await openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(
        CASE_STATUS.READY_FOR_REVIEW,
        `/cases/${caseId}`
      )
    );
  });

  test("submitAction and setCaseStatus are called when click on confirmation of submit for review dialog", async () => {
    store.dispatch(
      getCaseDetailsSuccess({
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: []
      })
    );

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
      .find("[data-testid='submit-for-review-button']")
      .first();
    await openSubmitForReviewButton.simulate("click");

    wrapper.update();

    const submitForReviewButton = wrapper
      .find("[data-testid='update-case-status-button']")
      .first();
    submitForReviewButton.simulate("click");

    expect(submitSpy).toHaveBeenCalledWith(
      null,
      expect.anything(),
      expect.anything()
    );
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
      .find('[data-testid="review-and-approve-letter-button"]')
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
      .find('[data-testid="review-and-approve-letter-button"]')
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
      .find('[data-testid="review-and-approve-letter-button"]')
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
      .find('[data-testid="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-testid="letter-preview"]').first();

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
      .find('[data-testid="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-testid="letter-preview"]').first();

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
      .find('[data-testid="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-testid="letter-preview"]').first();

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
      .find('[data-testid="edit-confirmation-dialog-button"]')
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
      .find('[data-testid="edit-confirmation-dialog-button"]')
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
    const backButton = wrapper.find('[data-testid="back-button"]').first();
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
      .find('[data-testid="letter-preview-approved-message"]')
      .first();
    const preview = wrapper.find('[data-testid="letter-preview"]').first();

    expect(message.exists()).toEqual(true);
    expect(preview.exists()).toEqual(false);
  });

  describe("Saves and Redirects when click Stepper Buttons", function () {
    test("it dispatches edit and redirects to recommended actions when click recommended actions stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-testid="step-button-Recommended Actions"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(submitSpy).toHaveBeenCalledWith(
        `/cases/${caseId}/letter/recommended-actions`
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
          recipientAddress: "jane's address",
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
      .find("[data-testid='edit-confirmation-dialog-button']")
      .first();
    editButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openEditLetterConfirmationDialog()
    );
  });

  test("dispatches startLetterDownload and getLetterPdf with edit info when download button is clicked and pdf has been edited", () => {
    store.dispatch(
      getReferralLetterPreviewSuccess(
        "Letter Preview HTML",
        {
          sender: "bob",
          recipient: "jane",
          recipientAddress: "jane's address",
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
      .find('[data-testid="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(startLetterDownload());
    expect(submitSpy).toHaveBeenCalledWith(
      null,
      wrapper.find(LetterPreview).instance().downloadLetterAsPdfFile,
      expect.anything()
    );
  });

  test("dispatches startLetterDownload and getLetterPdf with edit info when download button is clicked and pdf is unedited", () => {
    store.dispatch(getCaseDetailsSuccess(caseDetail));
    dispatchSpy.mockClear();
    const downloadButton = wrapper
      .find('[data-testid="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(startLetterDownload());
    expect(submitSpy).toHaveBeenCalledWith(
      null,
      wrapper.find(LetterPreview).instance().downloadLetterAsPdfFile,
      expect.anything()
    );
  });

  test("test that download button has correct text based on edit history", () => {
    const downloadButton = wrapper
      .find('[data-testid="download-letter-as-pdf"]')
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
          recipientAddress: "jane's address",
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
      .find('[data-testid="download-letter-as-pdf"]')
      .first();
    downloadButton.simulate("click");

    wrapper.update();
    const progressIndicator = wrapper
      .find('[data-testid="download-letter-progress"]')
      .first();
    downloadButton = wrapper
      .find('[data-testid="download-letter-as-pdf"]')
      .first();
    expect(downloadButton.props().disabled).toBeTruthy();
    expect(progressIndicator.props().style.display).toEqual("");
  });

  test("test that download button is enabled and progress indicator is not visible by default", () => {
    const downloadButton = wrapper
      .find('[data-testid="download-letter-as-pdf"]')
      .first();

    const progressIndicator = wrapper
      .find('[data-testid="download-letter-progress"]')
      .first();
    expect(downloadButton.props().disabled).toBeFalsy();
    expect(progressIndicator.props().style.display).toEqual("none");
  });

  test("should call missing complainant dialog when complainant is missing", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        complainantCivilians: [],
        complainantOfficers: [],
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

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
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openMissingComplainantDialog(expect.anything())
    );
  });

  test("should call incomplete officer history dialog when accused officer is missing officer history", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getCaseDetailsSuccess({
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: [],
        accusedOfficers: [
          { fullName: "somebody", officerHistoryOptionId: null }
        ]
      })
    );

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

    store.dispatch(
      getFeaturesSuccess({
        allowAccusedOfficersToBeBlankFeature: true
      })
    );

    const openSubmitForReviewButton = wrapper
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openIncompleteOfficerHistoryDialog(expect.anything())
    );
  });

  test("shouldn't call incomplete officer history dialog with allowAccusedOfficerToBeBlank feature flag and no accused selected", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getCaseDetailsSuccess({
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: [],
        accusedOfficers: []
      })
    );

    store.dispatch(
      getFeaturesSuccess({
        allowAccusedOfficersToBeBlankFeature: true
      })
    );

    const openSubmitForReviewButton = wrapper
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect("Update Case Status").toBeInTheDocument;
  });

  test("should call missing classifications dialog when no classifications are selected", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getCaseDetailsSuccess({
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: [],
        accusedOfficers: [
          { fullName: "somebody", officerHistoryOptionId: null }
        ]
      })
    );

    store.dispatch(
      getFeaturesSuccess({
        allowAccusedOfficersToBeBlankFeature: true
      })
    );

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
    const openSubmitForReviewButton = wrapper
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openIncompleteClassificationsDialog(expect.anything())
    );
  });

  test("shouldn't call missing classifications dialog when no classifications are selected with allowAccusedOfficerToBeBlank feature flag and no accused selected", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getCaseDetailsSuccess({
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: [],
        accusedOfficers: []
      })
    );

    store.dispatch(
      getFeaturesSuccess({
        allowAccusedOfficersToBeBlankFeature: true
      })
    );

    const openSubmitForReviewButton = wrapper
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect("Update Case Status").toBeInTheDocument;
  });

  test("should call incomplete officer history dialog if both classifications and officer history are missing", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getCaseDetailsSuccess({
        complainantCivilians: [{ fullName: "someone" }],
        complainantOfficers: []
      })
    );

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
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openIncompleteOfficerHistoryDialog(expect.anything())
    );
  });

  test("should call missing complainant dialog if complainant information, classifications, and officer history are missing", () => {
    dispatchSpy.mockClear();
    store.dispatch(
      getReferralLetterSuccess({
        caseDetails: {
          complainantCivilians: [],
          complainantOfficers: []
        },
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
      .find("[data-testid='submit-for-review-button']")
      .first();
    openSubmitForReviewButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openMissingComplainantDialog(expect.anything())
    );
  });

  describe("validation when case status is ready for review", () => {
    beforeEach(() => {
      dispatchSpy.mockClear();
      store.dispatch(
        getCaseDetailsSuccess({
          id: caseId,
          complainantCivilians: [{ fullName: "someone" }],
          complainantOfficers: [],
          status: CASE_STATUS.READY_FOR_REVIEW,
          nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );
      store.dispatch(
        userAuthSuccess({
          permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
        })
      );
    });

    test("should not approve letter with missing complainant", async () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: caseId,
          complainantCivilians: [],
          complainantOfficers: [],
          status: CASE_STATUS.READY_FOR_REVIEW,
          nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );

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
      wrapper.update();
      const openReviewAndApproveButton = wrapper
        .find("[data-testid='review-and-approve-letter-button']")
        .first();
      openReviewAndApproveButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openMissingComplainantDialog(expect.anything())
      );
    });

    test("should not approve letter with missing officer history details", async () => {
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
      wrapper.update();
      const openReviewAndApproveButton = wrapper
        .find("[data-testid='review-and-approve-letter-button']")
        .first();
      openReviewAndApproveButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openIncompleteOfficerHistoryDialog(expect.anything())
      );
    });

    test("should not approve letter with missing classifications", () => {
      store.dispatch(
        getReferralLetterSuccess({
          letterOfficers: [
            {
              fullName: "somebody",
              officerHistoryOptionId: 1
            }
          ],
          classifications: {}
        })
      );
      wrapper.update();
      const openReviewAndApproveButton = wrapper
        .find("[data-testid='review-and-approve-letter-button']")
        .first();
      openReviewAndApproveButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openIncompleteClassificationsDialog(expect.anything())
      );
    });
  });

  describe("without permissions", () => {
    let store, dispatchSpy, wrapper, caseId;
    beforeEach(() => {
      store = createConfiguredStore();
      dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.MANAGE_TAGS] }
      });

      wrapper = mount(
        <Provider store={store}>
          <Router>
            <ReferralLetterPreview match={{ params: { id: caseId } }} />
          </Router>
        </Provider>
      );
      dispatchSpy.mockClear();
    });

    test("should not be able to view Edit Letter button", () => {
      expect(
        wrapper.find('[data-testid="edit-confirmation-dialog-button"]')
      ).toHaveLength(0);
    });

    test("should not be able to view Submit for Review button", () => {
      expect(
        wrapper.find('[data-testid="submit-for-review-button"]')
      ).toHaveLength(0);
    });
  });
});
