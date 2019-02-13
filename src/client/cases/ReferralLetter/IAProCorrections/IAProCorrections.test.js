import createConfiguredStore from "../../../createConfiguredStore";
import React from "react";
import IAProCorrections from "./IAProCorrections";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme";
import editIAProCorrections from "../thunks/editIAProCorrections";
import getReferralLetterData from "../thunks/getReferralLetterData";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";

jest.mock("../thunks/getReferralLetterData", () => caseId => ({
  type: "getReferralLetterData",
  caseId
}));
jest.mock("../thunks/getReferralLetterEditStatus", () => caseId => ({
  type: "getReferralLetterEditStatus",
  caseId
}));
jest.mock("../../thunks/getMinimumCaseDetails", () => caseId => ({
  type: "getMinimumCaseDetails",
  caseId
}));
jest.mock(
  "../thunks/editIAProCorrections",
  () => (caseId, values, redirectUrl) => ({
    type: "editIAProCorrections",
    caseId,
    values,
    redirectUrl
  })
);

describe("IAProCorrections", function() {
  let caseId, store, dispatchSpy, wrapper;
  beforeEach(() => {
    caseId = "88";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    const referralLetterWithIAProCorrections = {
      id: caseId,
      caseId: caseId,
      letterOfficers: [],
      referralLetterIAProCorrections: [
        { id: "1", details: "details1" },
        { id: "2", details: "details2" }
      ]
    };

    store.dispatch(
      getReferralLetterSuccess(referralLetterWithIAProCorrections)
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <IAProCorrections match={{ params: { id: caseId } }} />
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

  test("loads min case details on mount so case reference can be displayed", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getMinimumCaseDetails(caseId));
  });

  test("there is a card for each iapro correction", () => {
    const iaproCorrectionCards = wrapper.find("[data-test='iapro-correction']");
    expect(iaproCorrectionCards.length).toEqual(2);
  });

  test("it should add an iapro correction when click add iapro correction button", () => {
    const addIAProCorrectionButton = wrapper
      .find('[data-test="addIAProCorrectionButton"]')
      .first();
    addIAProCorrectionButton.simulate("click");
    expect(wrapper.find("[data-test='iapro-correction']").length).toEqual(3);
  });

  test("it should open the remove iapro correction dialog when click remove iapro correction button", () => {
    const openRemoveIAProCorrectionDialogButton = wrapper
      .find(
        "[data-test='referralLetterIAProCorrections[0]-open-remove-dialog-button']"
      )
      .first();
    openRemoveIAProCorrectionDialogButton.simulate("click");
    const removeIAProCorrectionButton = wrapper
      .find("[data-test='remove-iapro-correction-button']")
      .first();
    removeIAProCorrectionButton.simulate("click");
    expect(wrapper.find("[data-test='iapro-correction']").length).toEqual(1);
  });

  test("calls editIAProCorrections with case id, form values, and redirect url when click back to case", () => {
    dispatchSpy.mockClear();

    const button = wrapper
      .find("[data-test='save-and-return-to-case-link']")
      .first();
    button.simulate("click");
    const expectedFormValues = {
      referralLetterIAProCorrections: [
        { id: "1", details: "details1" },
        { id: "2", details: "details2" }
      ]
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editIAProCorrections(caseId, expectedFormValues, `/cases/${caseId}`)
    );
  });

  test("calls editIAProCorrections with case id, form values, and redirect url when click back button", () => {
    const backButton = wrapper.find("[data-test='back-button']").first();
    backButton.simulate("click");
    const expectedFormValues = {
      referralLetterIAProCorrections: [
        { id: "1", details: "details1" },
        { id: "2", details: "details2" }
      ]
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editIAProCorrections(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/officer-history`
      )
    );
  });

  test("calls editIAProCorrections with case id, form values, and redirect url when click next button", () => {
    const nextButton = wrapper.find("[data-test='next-button']").first();
    nextButton.simulate("click");
    const expectedFormValues = {
      referralLetterIAProCorrections: [
        { id: "1", details: "details1" },
        { id: "2", details: "details2" }
      ]
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editIAProCorrections(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/recommended-actions`
      )
    );
  });

  describe("Saves and Redirects when click Stepper Buttons", function() {
    let expectedFormValues;
    beforeEach(function() {
      expectedFormValues = {
        referralLetterIAProCorrections: [
          { id: "1", details: "details1" },
          { id: "2", details: "details2" }
        ]
      };
    });

    test("it dispatches edit and redirects to review letter when click review case details stepper button", () => {
      const reviewCaseDetailsButton = wrapper
        .find('[data-test="step-button-Review Case Details"]')
        .first();
      reviewCaseDetailsButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        editIAProCorrections(
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
        editIAProCorrections(
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
        editIAProCorrections(
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
        editIAProCorrections(
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
        editIAProCorrections(
          caseId,
          expectedFormValues,
          `/cases/${caseId}/letter/letter-preview`
        )
      );
    });
  });
});
