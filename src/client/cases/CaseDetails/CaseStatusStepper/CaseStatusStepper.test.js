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
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { userAuthSuccess } from "../../../auth/actionCreators";
import CaseStatusStepper from "./CaseStatusStepper";
import { BrowserRouter as Router } from "react-router-dom";

describe("CaseStatusStepper", () => {
  let store;
  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(
      userAuthSuccess({
        permissions: [USER_PERMISSIONS.CAN_REVIEW_CASE]
      })
    );
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
        <CaseStatusStepper />
      </Provider>
    );
    const statusStepper = wrapper.find('[data-test="statusStepper"]').first();

    expect(statusStepper.prop("activeStep")).toEqual(4);
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

  test("should show resume letter button when case is in ready for review status", () => {
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

    expect(updateStatusButton.text()).toEqual(`Resume Letter`);
  });

  test("should open update status dialog without redirect url if next status not letter in progress", () => {
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

    expect(dispatchSpy).toHaveBeenCalledWith(openCaseStatusUpdateDialog());
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
      openCaseStatusUpdateDialog(`/cases/1/letter/review`)
    );
  });

  //put this back in once we play the card to allow approval again from letter generation flow
  test.skip("should render Forward to Agency if authorized to do so and currently in Ready for Review", () => {
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
      .find('[data-test="update-status-button"]')
      .first();

    expect(updateStatusButton.exists()).toEqual(true);
  });

  test("should not render Forward to Agency if not authorized to forward and currently in Ready for Review", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    store.dispatch(
      userAuthSuccess({
        permissions: []
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

    expect(updateStatusButton.exists()).toEqual(false);
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
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-test="update-status-button"]')
      .first();

    expect(updateStatusButton.exists()).toBeFalsy();
  });
});
