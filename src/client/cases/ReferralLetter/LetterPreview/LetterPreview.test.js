import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import LetterPreview from "./LetterPreview";
import {
  getLetterPreviewSuccess,
  openEditLetterConfirmationDialog
} from "../../../actionCreators/letterActionCreators";
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";
import { changeInput } from "../../../testHelpers";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import { push } from "react-router-redux";

jest.mock(
  "../thunks/editReferralLetterAddresses",
  () => (caseId, values, redirectUrl) => ({
    type: "SOMETHING",
    caseId,
    values,
    redirectUrl
  })
);

describe("LetterPreview", function() {
  let store, dispatchSpy, wrapper, caseId;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = "102";

    store.dispatch(
      getLetterPreviewSuccess(
        "Letter Preview HTML",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        false
      )
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <LetterPreview match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
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
    const editButton = wrapper.find("[data-test='edit-button']").first();
    editButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      openEditLetterConfirmationDialog()
    );
  });

  test("dispatch open case status dialog on click of submit for approval button", () => {
    dispatchSpy.mockClear();
    const submitForApprovalButton = wrapper
      .find("[data-test='submit-for-approval-button']")
      .first();
    submitForApprovalButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(`/cases/${caseId}`)
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
      getLetterPreviewSuccess(
        "Letter Preview HTML Edited",
        {
          sender: "bob",
          recipient: "jane",
          transcribedBy: "joe"
        },
        true
      )
    );

    dispatchSpy.mockClear();
    const editButton = wrapper.find("[data-test='edit-button']").first();
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
});
