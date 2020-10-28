import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeIncompleteClassificationsDialog,
  openIncompleteClassificationsDialog
} from "../../actionCreators/letterActionCreators";
import { Provider } from "react-redux";
import IncompleteClassificationsDialog from "./IncompleteClassificationsDialog";
import React from "react";
import { mount } from "enzyme";

describe("IncompleteClassificationsDialog", () => {
  let wrapper, caseId, nextStatus, dispatchSpy, store, redirectUrl;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    redirectUrl = "url";

    store.dispatch(openIncompleteClassificationsDialog());
    wrapper = mount(
      <Provider store={store}>
        <IncompleteClassificationsDialog />
      </Provider>
    );
  });

  test("should dispatch close and redirect to correct url", () => {
    const incompleteClassificationsReturnButton = wrapper
      .find('[data-testid="close-incomplete-history-dialog"]')
      .first();
    expect(incompleteClassificationsReturnButton.exists()).toBeDefined();
    incompleteClassificationsReturnButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      closeIncompleteClassificationsDialog()
    );
  });
});
