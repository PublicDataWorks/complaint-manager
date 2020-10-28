import createConfiguredStore from "../../../../createConfiguredStore";
import Case from "../../../../../sharedTestHelpers/case";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import {
  CASE_STATUS,
  EDIT_STATUS
} from "../../../../../sharedUtilities/constants";
import { getReferralLetterEditStatusSuccess } from "../../../actionCreators/letterActionCreators";
import LetterStatusMessage, {
  ARCHIVED_MESSAGE,
  PAGE_TYPE
} from "./LetterStatusMessage";
import { containsText } from "../../../../testHelpers";

describe("letter edit status message", () => {
  let wrapper, existingCase, dispatchSpy, store;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    existingCase = new Case.Builder()
      .defaultCase()
      .withId(612)
      .withStatus(CASE_STATUS.INITIAL)
      .build();

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <LetterStatusMessage />
        </Router>
      </Provider>
    );
  });

  test("does not display message when status data is not loaded yet", () => {
    store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.EDITED));
    wrapper.update();
    const letterStatusMessage = wrapper
      .find('[data-testid="letterStatusMessage"]')
      .first();

    expect(letterStatusMessage.exists()).toEqual(false);
  });

  test("does not display message when letter type data is not loaded yet", () => {
    getCaseDetailsSuccess({
      ...existingCase,
      status: CASE_STATUS.LETTER_IN_PROGRESS
    });
    wrapper.update();

    const letterStatusMessage = wrapper
      .find('[data-testid="letterStatusMessage"]')
      .first();

    expect(letterStatusMessage.exists()).toEqual(false);
  });

  test("does not display message when status is before letter in progress", () => {
    store.dispatch(getCaseDetailsSuccess(existingCase));
    wrapper.update();

    const letterStatusMessage = wrapper
      .find('[data-testid="letterStatusMessage"]')
      .first();
    expect(letterStatusMessage.exists()).toEqual(false);
  });

  test("does not display message when status is letter in progress and letter is unedited and unarchived", () => {
    store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.GENERATED));
    store.dispatch(
      getCaseDetailsSuccess({
        ...existingCase,
        status: CASE_STATUS.LETTER_IN_PROGRESS
      })
    );
    wrapper.update();

    const letterStatusMessage = wrapper
      .find('[data-testid="letterStatusMessage"]')
      .first();
    expect(letterStatusMessage.exists()).toEqual(false);
  });

  test("displays archived message when case is archived", () => {
    store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.GENERATED));
    store.dispatch(
      getCaseDetailsSuccess({
        ...existingCase,
        isArchived: true
      })
    );

    wrapper.update();

    const letterStatusMessage = wrapper
      .find('[data-testid="letterStatusMessage"]')
      .first();
    expect(letterStatusMessage.exists()).toEqual(true);
    expect(letterStatusMessage.text()).toEqual(ARCHIVED_MESSAGE);
  });

  describe("approval / edited message", () => {
    test("displays correct message when letter has been edited and status is before approval", () => {
      store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.EDITED));
      store.dispatch(
        getCaseDetailsSuccess({
          ...existingCase,
          status: CASE_STATUS.LETTER_IN_PROGRESS
        })
      );
      wrapper.update();

      const letterStatusMessage = wrapper
        .find('[data-testid="letterStatusMessage"]')
        .first();
      expect(letterStatusMessage.exists()).toEqual(true);
      expect(letterStatusMessage.text()).toContain(
        "The referral letter has been edited."
      );
    });

    test("displays correct message when letter has been approved and letter is edited", () => {
      store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.EDITED));
      store.dispatch(
        getCaseDetailsSuccess({
          ...existingCase,
          status: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );
      wrapper.update();

      const letterStatusMessage = wrapper
        .find('[data-testid="letterStatusMessage"]')
        .first();

      expect(letterStatusMessage.exists()).toEqual(true);
      expect(letterStatusMessage.text()).toContain(
        "The referral letter has been approved."
      );
    });

    test("displays correct message when letter is approved and not edited", () => {
      store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.GENERATED));
      store.dispatch(
        getCaseDetailsSuccess({
          ...existingCase,
          status: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );
      wrapper.update();

      const letterStatusMessage = wrapper
        .find('[data-testid="letterStatusMessage"]')
        .first();

      expect(letterStatusMessage.exists()).toEqual(true);
      expect(letterStatusMessage.text()).toContain(
        "The referral letter has been approved."
      );
    });
    test("should see correct message when letter has been approved", () => {
      store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.GENERATED));
      store.dispatch(
        getCaseDetailsSuccess({
          ...existingCase,
          status: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );

      wrapper.update();

      const letterStatusMessage = wrapper
        .find('[data-testid="letterStatusMessage"]')
        .first();

      expect(letterStatusMessage.exists()).toEqual(true);
      expect(letterStatusMessage.text()).toContain(
        "The referral letter has been approved."
      );
    });
  });

  describe("page appropriate message", () => {
    beforeEach(() => {
      store.dispatch(getReferralLetterEditStatusSuccess(EDIT_STATUS.EDITED));
      store.dispatch(
        getCaseDetailsSuccess({
          ...existingCase,
          status: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );
    });

    test("displays correct message on letter details page", () => {
      wrapper.update();

      containsText(
        wrapper,
        '[data-testid="letterStatusMessage"]',
        "Any changes made to the letter details will not be reflected in the letter"
      );
    });

    test("displays correct message on case details page", () => {
      wrapper = mount(
        <Provider store={store}>
          <Router>
            <LetterStatusMessage pageType={PAGE_TYPE.CASE_DETAILS} />
          </Router>
        </Provider>
      );

      containsText(
        wrapper,
        '[data-testid="letterStatusMessage"]',
        "Any changes made to the case details will not be reflected in the letter"
      );
    });
  });
});
