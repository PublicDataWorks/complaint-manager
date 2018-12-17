import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { push } from "react-router-redux";
import LetterReview from "./LetterReview";
import { mount } from "enzyme";
import React from "react";

jest.mock("../../thunks/getCaseDetails", () => () => ({ type: "SOMETHING" }));

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

  test("does not redirect if case is in forwarded to agency status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
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
  test("does not redirect if case is in closed status", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.CLOSED,
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

  describe("Redirects when click Stepper Buttons", function() {
    beforeEach(function() {
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
    });
    test("it redirects to review letter when click review case details stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Review Case Details"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/review`)
      );
    });

    test("it redirects to officer history when click officer history stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Officer Complaint Histories"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/officer-history`)
      );
    });

    test("it redirects to iapro corrections when click iapro corrections stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-IAPro Corrections"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/iapro-corrections`)
      );
    });

    test("it redirects to recommended actions when click recommended actions stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Recommended Actions"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/recommended-actions`)
      );
    });

    test("it redirects to preview when click preview stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Preview"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        push(`/cases/${caseId}/letter/letter-preview`)
      );
    });
  });
});
