import UpdateCaseStatusDialog from "./UpdateCaseStatusDialog";
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeCaseStatusUpdateDialog,
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import setCaseStatus from "../../thunks/setCaseStatus";

jest.mock("../../thunks/setCaseStatus", () => (caseId, status, redirectUrl) => {
  return {
    type: "MOCK_ACTION",
    status,
    caseId,
    redirectUrl
  };
});

describe("UpdateCaseStatusDialog", () => {
  let wrapper, caseId, nextStatus, dispatchSpy, store, redirectUrl;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    nextStatus = CASE_STATUS.READY_FOR_REVIEW;
    redirectUrl = "url";

    store.dispatch(
      getCaseDetailsSuccess({ id: caseId, nextStatus: nextStatus })
    );
    store.dispatch(openCaseStatusUpdateDialog(nextStatus, redirectUrl));
    wrapper = mount(
      <Provider store={store}>
        <UpdateCaseStatusDialog />
      </Provider>
    );
  });

  test("submit button should display Mark as NEXT CASE STATUS", () => {
    const updateCaseStatusButton = wrapper
      .find('[data-test="update-case-status-button"]')
      .first();

    expect(updateCaseStatusButton.exists()).toBeDefined();
    expect(updateCaseStatusButton.text()).toEqual(`Mark as ${nextStatus}`);
  });

  test("should dispatch thunk with given redirect url if submit is clicked and no alt action given", () => {
    const updateCaseStatusButton = wrapper
      .find('[data-test="update-case-status-button"]')
      .first();

    expect(updateCaseStatusButton.exists()).toBeDefined();
    updateCaseStatusButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      setCaseStatus(caseId, nextStatus, redirectUrl)
    );
  });

  test("should call alternative action with update status callback and close dialog callback if alternative callback given when primary button clicked", () => {
    const alternativeAction = jest.fn(() => () => {});
    wrapper = mount(
      <Provider store={store}>
        <UpdateCaseStatusDialog alternativeAction={alternativeAction} />
      </Provider>
    );

    const updateCaseStatusButton = wrapper
      .find('[data-test="update-case-status-button"]')
      .first();
    updateCaseStatusButton.simulate("click");
    expect(alternativeAction).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  test("should call alternative action close dialog callback (and not update status callback) if alternative callback and doNotCallUpdateStatusCallback is true given when primary button clicked", () => {
    const alternativeAction = jest.fn(() => () => {});
    wrapper = mount(
      <Provider store={store}>
        <UpdateCaseStatusDialog
          alternativeAction={alternativeAction}
          doNotCallUpdateStatusCallback={true}
        />
      </Provider>
    );

    const updateCaseStatusButton = wrapper
      .find('[data-test="update-case-status-button"]')
      .first();
    updateCaseStatusButton.simulate("click");
    expect(alternativeAction).toHaveBeenCalledWith(
      caseId,
      expect.any(Function)
    );
  });

  test("should dispatch close if cancelled is clicked", () => {
    const updateCaseStatusButton = wrapper
      .find('[data-test="closeDialog"]')
      .first();

    expect(updateCaseStatusButton.exists()).toBeDefined();
    updateCaseStatusButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
  });
});
