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
import moment from "moment";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";

describe("ReviewAndApproveLetter", () => {
  const caseId = 100;
  let store, wrapper, dispatchSpy;
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
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ReviewAndApproveLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );

    dispatchSpy = jest.spyOn(store, "dispatch");
  });

  test("should display automatically generated correct time of date", () => {
    const displayDate = wrapper.find('[data-test="edit-history"]').first();
    const today = moment(Date.now()).format("MMM D, YYYY");
    expect(displayDate.text()).toEqual(`This letter was generated on ${today}`);
  });

  test("should display last edit history date", () => {
    const lastEditedTimestamp = moment(Date.now(), "MMM D, YYYY");
    const letterHtml = "<p>html</p>";
    const addresses = "<p>addresses</p>";
    store.dispatch(
      getLetterPreviewSuccess(letterHtml, addresses, {
        edited: true,
        lastEdited: lastEditedTimestamp
      })
    );
    wrapper.update();
    const displayDate = wrapper.find('[data-test="edit-history"]').first();
    expect(displayDate.text()).toEqual(
      `This letter was last edited on ${lastEditedTimestamp}`
    );
  });
});
