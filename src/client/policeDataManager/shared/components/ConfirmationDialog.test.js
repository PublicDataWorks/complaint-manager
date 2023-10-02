import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationDialog from "./ConfirmationDialog";

describe("ConfirmationDialog", () => {
  let onConfirm = jest.fn();
  let onCancel = jest.fn();
  beforeEach(() => {
    render(
      <ConfirmationDialog
        cancelText="Cancel this right now, are you crazy?"
        confirmText="Do it, bro"
        onConfirm={onConfirm}
        onCancel={onCancel}
        open={true}
        title="DELETE ALL THE THINGS!"
      >
        Hello, confirm that you want to delete the internet.
      </ConfirmationDialog>
    );
  });

  test("should render expected text", () => {
    expect(
      screen.getByText("Hello, confirm that you want to delete the internet.")
    ).toBeInTheDocument();
    expect(screen.getByText("DELETE ALL THE THINGS!")).toBeInTheDocument();
  });

  test("should render cancel and confirm buttons with the given text", () => {
    expect(screen.getByTestId("dialog-cancel-button").textContent).toEqual(
      "Cancel this right now, are you crazy?"
    );
    expect(screen.getByTestId("dialog-confirm-button").textContent).toEqual(
      "Do it, bro"
    );
  });

  test("should call onCancel when cancel button is clicked", () => {
    userEvent.click(screen.getByTestId("dialog-cancel-button"));
    expect(onCancel).toHaveBeenCalled;
  });

  test("should call onConfirm when confirm button is clicked", () => {
    userEvent.click(screen.getByTestId("dialog-confirm-button"));
    expect(onConfirm).toHaveBeenCalled;
  });
});
