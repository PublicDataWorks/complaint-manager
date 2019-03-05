import { mount } from "enzyme";
import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  CASE_STATUS_MAP,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { userAuthSuccess } from "../../../auth/actionCreators";
import CaseStatusStepper from "./CaseStatusStepper";
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
    const statusStepper = wrapper.find('[data-test="statusStepper"]').first();

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
    const statusStepper = wrapper.find('[data-test="statusStepper"]').first();

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

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-test="update-status-button"]')
      .first();

    updateStatusButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(
        CASE_STATUS.LETTER_IN_PROGRESS,
        `/cases/1/letter/review`
      )
    );
  });

  describe("user has permissions", () => {
    beforeEach(() => {
      store.dispatch(
        userAuthSuccess({
          permissions: [USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES]
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
        .find('[data-test="update-status-button"]')
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
        .find('[data-test="update-status-button"]')
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
        .find('[data-test="edit-letter-button"]')
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
        .find('[data-test="edit-letter-button"]')
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
        .find('[data-test="edit-letter-button"]')
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
        .find('[data-test="review-and-approve-letter-button"]')
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
        .find('[data-test="update-status-button"]')
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
        .find('[data-test="edit-letter-button"]')
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
        .find('[data-test="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeFalsy();
    });
  });

  describe("user does not have special permissions", () => {
    beforeEach(() => {
      store.dispatch(
        userAuthSuccess({
          permissions: []
        })
      );
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
        .find('[data-test="update-status-button"]')
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
        .find('[data-test="edit-letter-button"]')
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
        .find('[data-test="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter`);
    });

    test("should not render Review and Approve button if not authorized to forward and currently in Ready for Review", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: CASE_STATUS.READY_FOR_REVIEW,
          nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
        })
      );

      store.dispatch(userAuthSuccess({ permissions: [] }));

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-test="update-status-button"]')
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
