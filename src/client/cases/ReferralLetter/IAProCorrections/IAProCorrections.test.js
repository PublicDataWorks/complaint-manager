import createConfiguredStore from "../../../createConfiguredStore";
import React from "react";
import IAProCorrections from "./IAProCorrections";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { mount } from "enzyme";

describe("IAProCorrections", function() {
  let caseId, store, dispatchSpy, wrapper;
  beforeEach(() => {
    caseId = "88";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <IAProCorrections match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("there is a card for each iapro correction", () => {
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
    wrapper.update();

    const iaproCorrectionCards = wrapper.find("[data-test='iapro-correction']");
    expect(iaproCorrectionCards.length).toEqual(2);
  });

  test("it should add an iapro correction when click add iapro correction button", () => {
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
    wrapper.update();
    const addIAProCorrectionButton = wrapper
      .find('[data-test="addIAProCorrectionButton"]')
      .first();
    addIAProCorrectionButton.simulate("click");
    expect(wrapper.find("[data-test='iapro-correction']").length).toEqual(3);
  });
});
