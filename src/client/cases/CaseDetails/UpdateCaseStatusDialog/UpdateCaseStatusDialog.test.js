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

jest.mock("../../thunks/setCaseStatus", () => (caseId, status) => ({
  type: "MOCK_ACTION",
  status,
  caseId
}));

describe("UpdateCaseStatusDialog", () => {
  let wrapper, caseId, nextStatus, dispatchSpy;
  beforeEach(() => {
    const store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    nextStatus = CASE_STATUS.READY_FOR_REVIEW;

    store.dispatch(
      getCaseDetailsSuccess({ id: caseId, nextStatus: nextStatus })
    );
    store.dispatch(openCaseStatusUpdateDialog());
    wrapper = mount(
      <Provider store={store}>
        <UpdateCaseStatusDialog />
      </Provider>
    );
  });

  test("submit button should display Mark as NEXT CASE STATUS", () => {
    const updateCaseStatusButton = wrapper
      .find('[data-test="updateCaseStatus"]')
      .first();

    expect(updateCaseStatusButton.exists()).toBeDefined();
    expect(updateCaseStatusButton.text()).toEqual(`Mark as ${nextStatus}`);
  });

  test("should dispatch thunk if submit is clicked", () => {
    const updateCaseStatusButton = wrapper
      .find('[data-test="updateCaseStatus"]')
      .first();

    expect(updateCaseStatusButton.exists()).toBeDefined();
    updateCaseStatusButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(setCaseStatus(caseId, nextStatus));
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
