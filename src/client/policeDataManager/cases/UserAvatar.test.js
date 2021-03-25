import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import UserAvatar from "./UserAvatar";

describe("UserAvatar", () => {
  it("should parse the first 2 letters of user's email and display in upper case", () => {
    render(<UserAvatar email="test@gmail.com"></UserAvatar>);
    expect(screen.getByText("TE")).toBeTruthy();
  });

  it("should display full email on mouse hover", () => {
    render(<UserAvatar email="test@gmail.com"></UserAvatar>);
    fireEvent.mouseMove(screen.getByText("TE"));
    expect(screen.getByTestId("tooltip-TE")).toBeTruthy();
  });
});
