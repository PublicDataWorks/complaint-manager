import createConfiguredStore from "../../../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import ArchiveCaseDialog from "./ArchiveCaseDialog";
import archiveCase from "../../thunks/archiveCase";

jest.mock("../../thunks/archiveCase", () => caseId => ({
  type: "MOCK_ARCHIVE_CASE",
  caseId
}));

describe("ArchiveCaseDialog", () => {
  let caseInfo, dispatchSpy, store, wrapper, closeDialog;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    caseInfo = {
      caseId: 1
    };

    closeDialog = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <ArchiveCaseDialog dialogOpen={true} closeDialog={closeDialog} />
      </Provider>
    );
  });

  test("should call archiveCase thunk with correct caseId", () => {
    const archiveCaseButton = wrapper
      .find('[data-testid="confirmArchiveCase"]')
      .first();
    archiveCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(archiveCase(caseInfo.id));
  });

  test("should close dialog when cancel button clicked", () => {
    const cancelButton = wrapper
      .find('[data-testid="cancelArchiveCaseButton"]')
      .first();
    cancelButton.simulate("click");
    expect(closeDialog).toHaveBeenCalled();
  });
});
