import createConfiguredStore from "../../../../createConfiguredStore";
import {
  getRecommendedActionsSuccess,
  getReferralLetterSuccess
} from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import RecommendedActions from "./RecommendedActions";
import React from "react";
import editRecommendedActions from "../thunks/editRecommendedActions";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import getReferralLetterData from "../thunks/getReferralLetterData";
import getCaseDetails from "../../thunks/getCaseDetails";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

jest.mock("../thunks/getReferralLetterData", () => caseId => ({
  type: "getReferralLetterData",
  caseId
}));
jest.mock("../thunks/getReferralLetterEditStatus", () => caseId => ({
  type: "getReferralLetterEditStatus",
  caseId
}));
jest.mock("../../thunks/getCaseDetails", () => caseId => ({
  type: "getCaseDetails",
  caseId
}));
jest.mock(
  "../thunks/editRecommendedActions",
  () => (caseId, values, redirectUrl) => ({
    type: "SOMETHING",
    caseId,
    values,
    redirectUrl
  })
);

describe("recommendedActions", function () {
  let referralLetterId, caseId, store, dispatchSpy, wrapper;
  beforeEach(() => {
    referralLetterId = "44";
    caseId = "88";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    const referralLetterWithRecommendedActions = {
      id: referralLetterId,
      caseId: caseId,
      includeRetaliationConcerns: true,
      letterOfficers: [
        { id: "1", referralLetterOfficerRecommendedActions: [1, 2, 3] },
        { id: "2", referralLetterOfficerRecommendedActions: [1, 3, 4] }
      ]
    };

    const recommendedActions = [
      { id: 1, description: "action 1" },
      { id: 2, description: "action 2" },
      { id: 3, description: "action 3" },
      { id: 4, description: "action 4" },
      { id: 5, description: "action 5" }
    ];

    store.dispatch(
      getReferralLetterSuccess(referralLetterWithRecommendedActions)
    );
    store.dispatch(getRecommendedActionsSuccess(recommendedActions));

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <RecommendedActions match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("loads referral letter data on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getReferralLetterData(caseId));
  });

  test("loads letter type on mount so message can be displayed", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      getReferralLetterEditStatus(caseId)
    );
  });

  test("loads case detail on mount so case reference can be displayed", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getCaseDetails(caseId));
  });

  test("calls editRecommendedActions with case id, form values, and redirect url when click back to case", () => {
    dispatchSpy.mockClear();

    const button = wrapper
      .find("[data-testid='save-and-return-to-case-link']")
      .first();
    button.simulate("click");
    const expectedFormValues = {
      id: referralLetterId,
      includeRetaliationConcerns: true,
      letterOfficers: [
        {
          id: "1",
          "action-1": true,
          "action-2": true,
          "action-3": true,
          referralLetterOfficerRecommendedActions: [1, 2, 3]
        },
        {
          id: "2",
          "action-1": true,
          "action-3": true,
          "action-4": true,
          referralLetterOfficerRecommendedActions: [1, 3, 4]
        }
      ]
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editRecommendedActions(caseId, expectedFormValues, `/cases/${caseId}`)
    );
  });

  test("calls editRecommendedActions with case id, form values, and redirect url when click back button", () => {
    const backButton = wrapper.find("[data-testid='back-button']").first();
    backButton.simulate("click");
    const expectedFormValues = {
      id: referralLetterId,
      includeRetaliationConcerns: true,
      letterOfficers: [
        {
          id: "1",
          "action-1": true,
          "action-2": true,
          "action-3": true,
          referralLetterOfficerRecommendedActions: [1, 2, 3]
        },
        {
          id: "2",
          "action-1": true,
          "action-3": true,
          "action-4": true,
          referralLetterOfficerRecommendedActions: [1, 3, 4]
        }
      ]
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editRecommendedActions(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/officer-history`
      )
    );
  });

  test("calls editRecommendedActions with case id, form values, and redirect url when click next button", () => {
    const nextButton = wrapper.find("[data-testid='next-button']").first();
    nextButton.simulate("click");
    const expectedFormValues = {
      id: referralLetterId,
      includeRetaliationConcerns: true,
      letterOfficers: [
        {
          id: "1",
          "action-1": true,
          "action-2": true,
          "action-3": true,
          referralLetterOfficerRecommendedActions: [1, 2, 3]
        },
        {
          id: "2",
          "action-1": true,
          "action-3": true,
          "action-4": true,
          referralLetterOfficerRecommendedActions: [1, 3, 4]
        }
      ]
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editRecommendedActions(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/letter-preview`
      )
    );
  });

  test("displays classification card", () => {
    expect(
      wrapper.find('[data-testid="classificationsContainer"]').exists()
    ).toBeTrue();
  });

  describe("Saves and Redirects when click Stepper Buttons", function () {
    let expectedFormValues;
    beforeEach(function () {
      expectedFormValues = {
        id: referralLetterId,
        includeRetaliationConcerns: true,
        letterOfficers: [
          {
            id: "1",
            "action-1": true,
            "action-2": true,
            "action-3": true,
            referralLetterOfficerRecommendedActions: [1, 2, 3]
          },
          {
            id: "2",
            "action-1": true,
            "action-3": true,
            "action-4": true,
            referralLetterOfficerRecommendedActions: [1, 3, 4]
          }
        ]
      };
    });

    test("it dispatches edit and redirects to review letter when click review case details stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-testid="step-button-Review Case Details"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editRecommendedActions(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/review`
        )
      );
    });

    test("it dispatches edit and redirects to officer history when click officer history stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-testid="step-button-Officer Complaint Histories"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editRecommendedActions(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/officer-history`
        )
      );
    });

    test("it dispatches edit and redirects to recommended actions when click recommended actions stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-testid="step-button-Recommended Actions"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editRecommendedActions(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/recommended-actions`
        )
      );
    });

    test("it dispatches edit and redirects to preview when click preview stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-testid="step-button-Preview"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editRecommendedActions(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/letter-preview`
        )
      );
    });
  });
});
