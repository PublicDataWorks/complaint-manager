import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
import ArchiveCaseButton from "./ArchiveCaseButton";
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
    render(
      <Provider store={store}>
        <ArchiveCaseButton />
      </Provider>
    );

    userEvent.click(screen.getByTestId("archiveCaseButton"));
  });

  test("should call archiveCase thunk with correct caseId", () => {
    const archiveCaseButton = screen.getByTestId("confirmArchiveCase");
    userEvent.click(archiveCaseButton);

    expect(dispatchSpy).toHaveBeenCalledWith(archiveCase(caseInfo.id));
  });

  test("should close dialog when cancel button clicked", async () => {
    const cancelButton = screen.getByTestId("cancelArchiveCaseButton");
    userEvent.click(cancelButton);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId("confirmArchiveCase")
    );
    expect(screen.queryByTestId("cancelArchiveCaseButton")).toBeFalsy();
  });
});
