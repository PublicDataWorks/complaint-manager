import RemoveCaseNoteDialog from "./RemoveCaseNoteDialog";
import createConfiguredStore from "../../../../createConfiguredStore";
import {
  closeRemoveCaseNoteDialog,
  openRemoveCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import removeCaseNote from "../../thunks/removeCaseNote";

jest.mock("../../thunks/removeCaseNote", () => (caseId, caseNoteId) => ({
  type: "MOCK_ACTION",
  caseId,
  caseNoteId
}));

describe("RemoveCaseNoteDialog", function () {
  test("should show author email if there is no author name", () => {
    const store = createConfiguredStore();
    const activity = {
      id: 1,
      caseId: 2,
      author: { email: "wineguy@yahoo.com" }
    };
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openRemoveCaseNoteDialog(activity));

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseNoteDialog />
      </Provider>
    );

    const button = wrapper.findWhere(node => {
      return (
        node.type() &&
        node.name() &&
        node.text().includes("[wineguy@yahoo.com]")
      );
    });

    expect(button).not.toBeNull();
  });

  test("should call removeCaseNote thunk with correct values", () => {
    const store = createConfiguredStore();
    const activity = {
      id: 1,
      caseId: 2,
      author: { name: "Jordan Ng", email: "wineguy@yahoo.com" }
    };
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openRemoveCaseNoteDialog(activity));

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseNoteDialog />
      </Provider>
    );

    const button = wrapper.findWhere(node => {
      return node.type() && node.name() && node.text().includes("Jordan Ng");
    });

    expect(button).not.toBeNull();

    const removeCaseNoteButton = wrapper
      .find('[data-testid="removeCaseNote"]')
      .first();
    removeCaseNoteButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      removeCaseNote(activity.caseId, activity.id)
    );
  });

  test("should close dialog when cancel button clicked", function () {
    const store = createConfiguredStore();
    store.dispatch(openRemoveCaseNoteDialog());
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <RemoveCaseNoteDialog />
      </Provider>
    );

    const cancelButton = wrapper.find('[data-testid="cancelButton"]').first();
    cancelButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
  });
});
