import createConfiguredStore from "../../createConfiguredStore";
import {
  closeIncompleteOfficerHistoryDialog,
  openIncompleteOfficerHistoryDialog
} from "../../actionCreators/letterActionCreators";
import { Provider } from "react-redux";
import IncompleteOfficerHistoryDialog from "./IncompleteOfficerHistoryDialog";
import React from "react";
import { mount } from "enzyme";

describe("IncompleteOfficerHistoryDialog", () => {
  let wrapper, caseId, nextStatus, dispatchSpy, store, redirectUrl;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    redirectUrl = "url";

    store.dispatch(openIncompleteOfficerHistoryDialog());
    wrapper = mount(
      <Provider store={store}>
        <IncompleteOfficerHistoryDialog />
      </Provider>
    );
  });

  test("should dispatch close and redirect to correct url", () => {
    const incompleteOfficerHistoryDialogReturnButton = wrapper
      .find('[data-test="close-incomplete-officer-history-dialog"]')
      .first();
    expect(incompleteOfficerHistoryDialogReturnButton.exists()).toBeDefined();
    incompleteOfficerHistoryDialogReturnButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      closeIncompleteOfficerHistoryDialog()
    );
  });
});
