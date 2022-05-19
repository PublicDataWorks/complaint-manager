import { mount, shallow } from "enzyme";
import React from "react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  CASE_STATUS_MAP,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";
import CaseStatusStepper from "./CaseStatusStepper";
import StatusButton from "../StatusButton/StatusButton";
import { BrowserRouter as Router } from "react-router-dom";
import getActiveStep from "./getActiveStep";

describe("CaseStatusStepper", () => {
  let store;
  beforeEach(() => {
    store = createConfiguredStore();
  });

  test("should set status to Initial", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.INITIAL,
        nextStatus: "blah"
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );
    const statusStepper = wrapper.find('[data-testid="statusStepper"]').first();

    expect(statusStepper.prop("activeStep")).toEqual(0);
  });

  test("should set status to Forwarded To Agency", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: "blah"
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseStatusStepper />
        </Router>
      </Provider>
    );
    const statusStepper = wrapper.find('[data-testid="statusStepper"]').first();

    expect(statusStepper.prop("activeStep")).toEqual(4);
  });

  test("should open update status dialog with redirect url if next status is letter in progress", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.ACTIVE,
        nextStatus: CASE_STATUS.LETTER_IN_PROGRESS
      })
    );
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.SETUP_LETTER] }
    });

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-testid="update-status-button"]')
      .first();

    updateStatusButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(
        CASE_STATUS.LETTER_IN_PROGRESS,
        `/cases/1/letter/review`
      )
    );
  });

  describe("with permissions", () => {
    beforeEach(() => {
      store.dispatch(
        userAuthSuccess({
          permissions: [
            USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES,
            USER_PERMISSIONS.SETUP_LETTER
          ]
        })
      );
    });

    test("should NOT show a button when a case is initial", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.INITIAL,
          nextStatus: "blah"
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <CaseStatusStepper />
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeFalsy();
    });

    test("should show `Begin Letter` button when case is active", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.ACTIVE,
          nextStatus: CASE_STATUS.LETTER_IN_PROGRESS
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeTruthy();
      expect(updateStatusButton.text()).toEqual(`Begin Letter`);
    });

    test("should show resume letter button when case is in letter in progress status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.LETTER_IN_PROGRESS,
          nextStatus: CASE_STATUS.READY_FOR_REVIEW
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Resume Letter`);
    });

    test("should show edit letter button when case is in ready for review status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.READY_FOR_REVIEW,
          nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter`);
    });

    test("should show edit letter button when case is in forwarded to agency status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.FORWARDED_TO_AGENCY,
          nextStatus: CASE_STATUS.CLOSED
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter Details`);
    });

    test("should show review and approve letter button when case is in ready for review status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.READY_FOR_REVIEW,
          nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const reviewAndApproveLetterButton = wrapper
        .find('[data-testid="review-and-approve-letter-button"]')
        .first();

      expect(reviewAndApproveLetterButton.text()).toEqual(
        `Review and Approve Letter`
      );
    });

    test("should open update status dialog without redirect url if next status is closed", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.FORWARDED_TO_AGENCY,
          nextStatus: CASE_STATUS.CLOSED
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      updateStatusButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCaseStatusUpdateDialog(CASE_STATUS.CLOSED)
      );
    });

    test("should show edit letter button when status is closed", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.CLOSED
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter Details`);
    });

    test("should not render Closed if already closed", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.CLOSED
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeFalsy();
    });
  });

  describe("without permissions", () => {
    beforeEach(() => {
      store.dispatch(
        userAuthSuccess({
          permissions: [USER_PERMISSIONS.MANAGE_TAGS]
        })
      );
    });

    test("should not show Begin Letter button", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      expect(wrapper.find('[data-testid="update-status-button"]')).toHaveLength(
        0
      );
    });

    test("should not show Resume/Edit Letter button", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      expect(wrapper.find('[data-testid="edit-letter-button"]')).toHaveLength(
        0
      );
    });

    test("should not show Review and Approve button", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toEqual(false);
    });
  });

  describe("getActiveStep", () => {
    test("increments last step value by 1 for map with letter in progress", () => {
      expect(getActiveStep(CASE_STATUS_MAP, CASE_STATUS.CLOSED)).toEqual(6);
    });

    test("does not increment for statuses other than closed", () => {
      expect(
        getActiveStep(CASE_STATUS_MAP, CASE_STATUS.READY_FOR_REVIEW)
      ).toEqual(3);
    });
  });
});
