import RemoveUserActionDialog from "./RemoveUserActionDialog";
import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeRemoveUserActionDialog,
  openRemoveUserActionDialog
} from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import removeUserAction from "../../thunks/removeUserAction";

jest.mock("../../thunks/removeUserAction", () => (caseId, userActionId) => ({
  type: "MOCK_ACTION",
  caseId,
  userActionId
}));

describe("RemoveUserActionDialog", function() {
  test("should call removeUserAction thunk with correct values", () => {
    const store = createConfiguredStore();
    const activity = {
      id: 1,
      caseId: 2
    };
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openRemoveUserActionDialog(activity));

    const wrapper = mount(
      <Provider store={store}>
        <RemoveUserActionDialog />
      </Provider>
    );

    const removeUserActionButton = wrapper
      .find('[data-test="removeUserAction"]')
      .first();
    removeUserActionButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removeUserAction(activity.caseId, activity.id)
    );
  });

  test("should close dialog when cancel button clicked", function() {
    const store = createConfiguredStore();
    store.dispatch(openRemoveUserActionDialog());
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <RemoveUserActionDialog />
      </Provider>
    );

    const cancelButton = wrapper.find('[data-test="cancelButton"]').first();
    cancelButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveUserActionDialog());
  });
});
