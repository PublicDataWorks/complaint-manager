import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import LetterPreview from "./LetterPreview";
import { push } from "react-router-redux";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";

describe("LetterPreview", function() {
  let store, dispatchSpy, wrapper, caseId, referralLetterId;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = "102";
    referralLetterId = "14";

    const referralLetterData = {
      id: referralLetterId,
      caseId: caseId
    };

    store.dispatch(getReferralLetterSuccess(referralLetterData));

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <LetterPreview match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("redirects to case details page when click back to case", () => {
    const button = wrapper
      .find("[data-test='save-and-return-to-case-link']")
      .first();
    button.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
