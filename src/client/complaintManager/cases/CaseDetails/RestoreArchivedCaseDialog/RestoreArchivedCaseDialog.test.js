import createConfiguredStore from "../../../../createConfiguredStore";
import RestoreArchivedCaseDialog from "./RestoreArchivedCaseDialog";
import React from "react";
import { mount } from "enzyme";
import {
  closeRestoreArchivedCaseDialog,
  getCaseDetailsSuccess,
  openRestoreArchivedCaseDialog
} from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import restoreArchivedCase from "../../thunks/restoreArchivedCase";

jest.mock("../../thunks/restoreArchivedCase", () => caseId => ({
  type: "MOCK_RESTORE_ARCHIVED_CASE",
  caseId
}));

describe("RestoreArchivedCaseDialog", () => {
  let store, dispatchSpy, wrapper;
  const caseId = 3;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openRestoreArchivedCaseDialog());
    store.dispatch(getCaseDetailsSuccess({ id: caseId }));

    wrapper = mount(
      <Provider store={store}>
        <RestoreArchivedCaseDialog />
      </Provider>
    );
  });
  test("should call restoreArchivedCase thunk with the correct values", () => {
    const restoreArchivedCaseButton = wrapper
      .find('[data-testid="confirmRestoreArchivedCase"]')
      .first();
    restoreArchivedCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(restoreArchivedCase(caseId));
  });
  test("should dispatch close dialog when cancel clicked", () => {
    const cancelRestoreArchivedCaseButton = wrapper
      .find('[data-testid="cancelRestoreArchivedCaseButton"]')
      .first();
    cancelRestoreArchivedCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(closeRestoreArchivedCaseDialog());
  });
});
