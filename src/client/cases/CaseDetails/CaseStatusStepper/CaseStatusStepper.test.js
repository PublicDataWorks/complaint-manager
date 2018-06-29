import CaseStatusStepper from "./CaseStatusStepper";
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

    expect(statusStepper.prop("activeStep")).toEqual(3);
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
      .find('[data-test="updateStatusButton"]')
      .first();

    expect(updateStatusButton.exists()).toBeFalsy();
  });

  test("should show a button when case is active", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.ACTIVE,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-test="updateStatusButton"]')
      .first();

    expect(updateStatusButton.exists()).toBeTruthy();
    expect(updateStatusButton.text()).toEqual(
      `Mark as ${CASE_STATUS.READY_FOR_REVIEW}`
    );
  });

  test("should open update status dialog and pass in the next status", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.ACTIVE,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-test="updateStatusButton"]')
      .first();

    updateStatusButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(CASE_STATUS.READY_FOR_REVIEW)
    );
  });

  test("should render Forward to Agency if authorized to do so and currently in Ready for Review", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.READY_FOR_REVIEW,
        nextStatus: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-test="updateStatusButton"]')
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
      .find('[data-test="updateStatusButton"]')
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
      .find('[data-test="updateStatusButton"]')
      .first();

    expect(updateStatusButton.exists()).toBeFalsy();
  });
});
