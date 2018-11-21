import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { userAuthSuccess } from "../../../auth/actionCreators";
import {
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import ReviewAndApproveLetter from "./ReviewAndApproveLetter";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { BrowserRouter as Router } from "react-router-dom";
import {
  getLetterPdfSuccess,
  getLetterPreviewSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import timekeeper from "timekeeper";
import { dateTimeFromString } from "../../../utilities/formatDate";

describe("ReviewAndApproveLetter", () => {
  const caseId = 100;
  let store, wrapper, dispatchSpy, nowTimestamp;
  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.CAN_REVIEW_CASE]
      })
    );

    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );
    store.dispatch(getLetterPdfSuccess("letter pdf"));
    nowTimestamp = new Date("2018-07-01 19:00:22 UTC");
    timekeeper.freeze(nowTimestamp);
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ReviewAndApproveLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
    dispatchSpy = jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    timekeeper.reset();
  });

  test("should display automatically generated correct time of date", () => {
    const displayDate = wrapper.find('[data-test="edit-history"]').first();
    expect(displayDate.text()).toEqual(
      `This letter was generated on ${dateTimeFromString(nowTimestamp)}`
    );
  });

  test("should display last edit history date", async () => {
    const letterHtml = "<p>html</p>";
    const addresses = "<p>addresses</p>";
    const inputDate = "2018-11-20T21:59:40.707Z";
    store.dispatch(
      getLetterPreviewSuccess(letterHtml, addresses, {
        edited: true,
        lastEdited: inputDate
      })
    );
    wrapper.update();
    const displayDate = wrapper.find('[data-test="edit-history"]').first();
    expect(displayDate.text()).toEqual(
      `This letter was last edited on ${dateTimeFromString(inputDate)}`
    );
  });

  test("displays progress indicator while downloading letter", () => {
    const progressIndicator = wrapper
      .find('[data-test="download-letter-progress"]')
      .first();
    expect(progressIndicator.props().style.display).toEqual("");
  });

  test("hides progress indicator while not downloading letter", () => {
    dispatchSpy(stopLetterDownload());
    wrapper.update();
    const progressIndicator = wrapper
      .find('[data-test="download-letter-progress"]')
      .first();
    expect(progressIndicator.props().style.display).toEqual("none");
  });
});
