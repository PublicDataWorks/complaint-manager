import createConfiguredStore from "../../../createConfiguredStore";
import React from "react";
import IAProCorrections from "./IAProCorrections";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme";
import editIAProCorrections from "../thunks/editIAProCorrections";
jest.mock("../thunks/editIAProCorrections", () =>
  jest.fn(() => () => (caseId, values, redirectUrl) => ({ type: "SOMETHING" }))
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
      referralLetterOfficers: [],
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
      .find("[data-test='open-remove-iapro-correction-dialog-button']")
      .first();
    openRemoveIAProCorrectionDialogButton.simulate("click");
    const removeIAProCorrectionButton = wrapper
      .find("[data-test='remove-iapro-correction-button']")
      .first();
    removeIAProCorrectionButton.simulate("click");
    expect(wrapper.find("[data-test='iapro-correction']").length).toEqual(1);
  });

  test("calls editIAProCorrections with case id, form values, and redirect url when click save and return to case", () => {
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
    expect(editIAProCorrections).toHaveBeenCalledWith(
      caseId,
      expectedFormValues,
      `/cases/${caseId}`
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
    expect(editIAProCorrections).toHaveBeenCalledWith(
      caseId,
      expectedFormValues,
      `/cases/${caseId}`
    );
  });
});
