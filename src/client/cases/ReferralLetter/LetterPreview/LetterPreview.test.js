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
      getLetterPreviewSuccess("Letter Preview HTML", {
        sender: "bob",
        recipient: "jane",
        transcribedBy: "joe"
      })
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <LetterPreview match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("dispatches editReferralLetterAddresses with correct values for return to case button", () => {
    dispatchSpy.mockClear();
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
    dispatchSpy.mockClear();
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

  test("dispatch openEditLetterConfirmationDialog when clicking edit button", () => {
    dispatchSpy.mockClear();
    const editButton = wrapper.find("[data-test='edit-button']").first();
    editButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      openEditLetterConfirmationDialog()
    );
  });
});
