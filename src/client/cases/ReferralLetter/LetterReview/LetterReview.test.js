import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
jest.mock("../../thunks/getCaseDetails", () => () => ({ type: "SOMETHING" }));
import { push } from "react-router-redux";
import LetterReview from "./LetterReview";
import { mount } from "enzyme";
import React from "react";

describe("LetterReview", () => {
  let caseId, dispatchSpy, store, wrapper;
  beforeEach(() => {
    caseId = "88";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <LetterReview match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("redirects to case detail page if case is prior to letter generation status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.ACTIVE
      })
    );
    wrapper.update();
    expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("redirects to case detail page if case is after letter generation status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );
    wrapper.update();
    expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("does not redirect if case is in letter in progress status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        complainantCivilians: [],
        complainantOfficers: [],
        witnessCivilians: [],
        witnessOfficers: [],
        accusedOfficers: []
      })
    );
    wrapper.update();
    expect(dispatchSpy).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("does not redirect if case is in ready for review status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.READY_FOR_REVIEW,
        complainantCivilians: [],
        complainantOfficers: [],
        witnessCivilians: [],
        witnessOfficers: [],
        accusedOfficers: []
      })
    );
    wrapper.update();
    expect(dispatchSpy).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
