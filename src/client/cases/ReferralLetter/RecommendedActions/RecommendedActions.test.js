import createConfiguredStore from "../../../createConfiguredStore";
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

jest.mock(
  "../thunks/editRecommendedActions",
  () => (caseId, values, redirectUrl) => ({
    type: "SOMETHING",
    caseId,
    values,
    redirectUrl
  })
);

describe("recommendedActions", function() {
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
      referralLetterOfficers: [
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

  test("calls editRecommendedActions with case id, form values, and redirect url when click save and return to case", () => {
    dispatchSpy.mockClear();

    const button = wrapper
      .find("[data-test='save-and-return-to-case-link']")
      .first();
    button.simulate("click");
    const expectedFormValues = {
      id: referralLetterId,
      includeRetaliationConcerns: true,
      referralLetterOfficers: [
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
    const backButton = wrapper.find("[data-test='back-button']").first();
    backButton.simulate("click");
    const expectedFormValues = {
      id: referralLetterId,
      includeRetaliationConcerns: true,
      referralLetterOfficers: [
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
        `/cases/${caseId}/letter/iapro-corrections`
      )
    );
  });
});
