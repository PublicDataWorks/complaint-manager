import React from "react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";
import {
  CASE_STATUS,
  EDIT_STATUS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import ReviewAndApproveLetter from "./ReviewAndApproveLetter";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { BrowserRouter as Router } from "react-router-dom";
import {
  finishLoadingPdfPreview,
  getReferralLetterPdfSuccess,
  getReferralLetterPreviewSuccess,
  startLoadingPdfPreview
} from "../../../actionCreators/letterActionCreators";
import timekeeper from "timekeeper";
import { dateTimeFromString } from "../../../../../sharedUtilities/formatDate";
import approveReferralLetter from "../thunks/approveReferralLetter";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";

jest.mock("../thunks/approveReferralLetter", () =>
  jest.fn((caseId, callback) => ({ type: "SOMETHING", caseId, callback }))
);

jest.mock("../../thunks/invalidCaseStatusRedirect", () =>
  jest.fn(() => (caseId, status, redirectUrl) => {})
);

jest.mock("../../UserAvatar", () => {
  return {
    __esModule: true,
    default: () => {
      return <div />;
    }
  };
});

describe("ReviewAndApproveLetter", () => {
  const caseId = 100;
  let store, wrapper, dispatchSpy, nowTimestamp;
  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
      })
    );

    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );
    store.dispatch(getReferralLetterPdfSuccess("letter pdf"));
    dispatchSpy = jest.spyOn(store, "dispatch");

    nowTimestamp = new Date("2018-07-01 19:00:22 UTC");
    timekeeper.freeze(nowTimestamp);
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ReviewAndApproveLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    timekeeper.reset();
  });

  test("should not display anything when lettertype is null", () => {
    const displayDate = wrapper.find('[data-testid="edit-history"]').first();
    expect(displayDate.text()).toEqual("");
  });

  test("should display today's date when letter is generated", () => {
    const displayDate = wrapper.find('[data-testid="edit-history"]').first();
    const letterHtml = "<p>html</p>";
    const addresses = "<p>addresses</p>";
    store.dispatch(
      getReferralLetterPreviewSuccess(
        letterHtml,
        addresses,
        EDIT_STATUS.GENERATED,
        null
      )
    );
    expect(displayDate.text()).toEqual(
      `This letter was generated on ${dateTimeFromString(nowTimestamp)}`
    );
  });

  test("should show approve button when in ready for review status", async () => {
    const letterHtml = "<p>html</p>";
    const addresses = "<p>addresses</p>";
    const inputDate = "2018-11-20T21:59:40.707Z";
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    store.dispatch(
      getReferralLetterPreviewSuccess(
        letterHtml,
        addresses,
        EDIT_STATUS.EDITED,
        inputDate
      )
    );
    wrapper.update();
    const approveButton = wrapper
      .find('[data-testid="approve-letter-button"]')
      .first();
    expect(approveButton.exists()).toEqual(true);
  });

  test("should display last edit history date when in ready for review status", async () => {
    const letterHtml = "<p>html</p>";
    const addresses = "<p>addresses</p>";
    const inputDate = "2018-11-20T21:59:40.707Z";
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    store.dispatch(
      getReferralLetterPreviewSuccess(
        letterHtml,
        addresses,
        EDIT_STATUS.EDITED,
        inputDate
      )
    );
    wrapper.update();
    const displayDate = wrapper.find('[data-testid="edit-history"]').first();
    expect(displayDate.text()).toEqual(
      `This letter was last edited on ${dateTimeFromString(inputDate)}`
    );
  });

  test("displays modal when approve letter button clicked", () => {
    const approveLetterButton = wrapper
      .find('[data-testid="approve-letter-button"]')
      .first();
    approveLetterButton.simulate("click");
    const approveLetterDialog = wrapper
      .find('[data-testid="dialogText"]')
      .first();
    expect(approveLetterDialog.text()).toContain(
      `This action will mark the case as ${CASE_STATUS.FORWARDED_TO_AGENCY}`
    );
  });

  test("dispatches the approve letter thunk when update case status dialog button clicked", () => {
    const approveLetterButton = wrapper
      .find('[data-testid="approve-letter-button"]')
      .first();
    approveLetterButton.simulate("click");

    const dialogSubmitButton = wrapper
      .find('[data-testid="update-case-status-button"]')
      .first();
    dialogSubmitButton.simulate("click");
    expect(approveReferralLetter).toHaveBeenCalledWith(
      caseId,
      expect.any(Function)
    );
  });

  test("redirects to case details page when letter is approved", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: CASE_STATUS.CLOSED
      })
    );
    wrapper.update();

    expect(invalidCaseStatusRedirect).toHaveBeenCalledWith(caseId);
  });

  test("redirects to case details page when letter is closed", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.CLOSED,
        nextStatus: null
      })
    );
    wrapper.update();

    expect(invalidCaseStatusRedirect).toHaveBeenCalledWith(caseId);
  });
});
