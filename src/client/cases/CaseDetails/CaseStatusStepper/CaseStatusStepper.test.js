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
        status: CASE_STATUS.INITIAL
      })
    );

    let wrapper = mount(
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
        status: CASE_STATUS.FORWARDED_TO_AGENCY
      })
    );

    let wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );
    const statusStepper = wrapper.find('[data-test="statusStepper"]').first();

    expect(statusStepper.prop("activeStep")).toEqual(3);
  });
});
