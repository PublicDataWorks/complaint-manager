import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { mockLocalStorage } from "../../../../mockLocalStorage";
import createConfiguredStore from "../../../createConfiguredStore";
import Case from "../../../testUtilities/case";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import CaseDetails from "../CaseDetails";
import React from "react";
import {
  CASE_STATUS,
  LETTER_TYPE
} from "../../../../sharedUtilities/constants";
import { getLetterTypeSuccess } from "../../../actionCreators/letterActionCreators";

describe("letter edit status message", () => {
  let wrapper, existingCase, dispatchSpy, store;
  beforeEach(() => {
    const incidentDateInUTC = "2017-12-25T06:00Z";
    mockLocalStorage();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    existingCase = new Case.Builder()
      .defaultCase()
      .withId(612)
      .withStatus(CASE_STATUS.INITIAL)
      .build();

    store.dispatch(getCaseDetailsSuccess(existingCase));
    store.dispatch(
      getFeaturesSuccess({ editLetterStatusMessageFeature: true })
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseDetails match={{ params: { id: existingCase.id.toString() } }} />
        </Router>
      </Provider>
    );
  });

  test("should not see message when status is before letter in progress", () => {
    wrapper.update();

    const editLetterStatusMessage = wrapper
      .find('[data-test="editLetterStatusMessage"]')
      .first();

    expect(editLetterStatusMessage.exists()).toEqual(false);
  });

  test("should not see message when status is letter in progress and letter is unedited", () => {
    store.dispatch(getLetterTypeSuccess(LETTER_TYPE.GENERATED));
    store.dispatch(
      getCaseDetailsSuccess({
        ...existingCase,
        status: CASE_STATUS.LETTER_IN_PROGRESS
      })
    );

    wrapper.update();

    const editLetterStatusMessage = wrapper
      .find('[data-test="editLetterStatusMessage"]')
      .first();

    expect(editLetterStatusMessage.exists()).toEqual(false);
  });

  test("should see correct message when letter has been edited and before approval", () => {
    store.dispatch(getLetterTypeSuccess(LETTER_TYPE.EDITED));
    store.dispatch(
      getCaseDetailsSuccess({
        ...existingCase,
        status: CASE_STATUS.LETTER_IN_PROGRESS
      })
    );

    wrapper.update();

    const editLetterStatusMessage = wrapper
      .find('[data-test="editLetterStatusMessage"]')
      .first();

    expect(editLetterStatusMessage.exists()).toEqual(true);
    expect(editLetterStatusMessage.text()).toContain(
      "The referral letter has been edited."
    );
  });

  test("should see correct message when letter has been approved", () => {
    store.dispatch(getLetterTypeSuccess(LETTER_TYPE.EDITED));
    store.dispatch(
      getCaseDetailsSuccess({
        ...existingCase,
        status: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    wrapper.update();

    const editLetterStatusMessage = wrapper
      .find('[data-test="editLetterStatusMessage"]')
      .first();

    expect(editLetterStatusMessage.exists()).toEqual(true);
    expect(editLetterStatusMessage.text()).toContain(
      "The referral letter has been approved."
    );
  });
});
