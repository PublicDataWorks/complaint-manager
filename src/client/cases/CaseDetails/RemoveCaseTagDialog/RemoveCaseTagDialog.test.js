import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeRemoveCaseTagDialog,
  openRemoveCaseTagDialog
} from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import RemoveCaseTagDialog from "./RemoveCaseTagDialog";
import removeCaseTag from "../../thunks/removeCaseTag";

jest.mock("../../thunks/removeCaseTag", () => (caseId, caseTagId) => ({
  type: "MOCK_ACTION",
  caseId,
  caseTagId
}));

describe("RemoveCaseTagDialog", () => {
  test("should call removeCaseTag thunk with correct values", () => {
    const store = createConfiguredStore();
    const caseTag = {
      id: 1,
      caseId: 1,
      tagId: 1,
      tag: {
        id: 1,
        name: "Penguin"
      }
    };
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openRemoveCaseTagDialog(caseTag));

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseTagDialog />
      </Provider>
    );

    const removeCaseTagButton = wrapper
      .find('[data-test="removeCaseTag"]')
      .first();
    removeCaseTagButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removeCaseTag(caseTag.caseId, caseTag.id)
    );
  });

  test("should close dialog when cancel button clicked", () => {
    const store = createConfiguredStore();

    const caseTag = {
      id: 1,
      caseId: 1,
      tagId: 1,
      tag: {
        id: 1,
        name: "Penguin"
      }
    };

    store.dispatch(openRemoveCaseTagDialog(caseTag));
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseTagDialog />
      </Provider>
    );

    const cancelButton = wrapper.find('[data-test="cancelButton"]').first();
    cancelButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCaseTagDialog());
  });
});
