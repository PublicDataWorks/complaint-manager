import CaseStatusStepper from "./CaseStatusStepper";
import { mount } from "enzyme";
import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

describe("CaseStatusStepper", () => {
  test("should set status to Initial", () => {
    const store = createConfiguredStore();
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.INITIAL,
        nextStatus: 'blah'
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
    const store = createConfiguredStore();
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: 'blah'
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
    const store = createConfiguredStore();
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.INITIAL,
        nextStatus: 'blah'
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
    const store = createConfiguredStore();
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
    expect(updateStatusButton.text()).toEqual(CASE_STATUS.READY_FOR_REVIEW);
  });
});
