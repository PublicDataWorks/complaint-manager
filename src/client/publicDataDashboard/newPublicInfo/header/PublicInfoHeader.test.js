import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublicInfoHeader from "./PublicInfoHeader";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

const expectHeaderMenuButtonsToExist = () => {
  expect(screen.getByText("Home")).toBeInTheDocument;
  expect(screen.getByText("Contact")).toBeInTheDocument;
  expect(screen.getByText("Stay Connected")).toBeInTheDocument;
};

describe("Public Info Header", () => {
  [SCREEN_SIZES.MOBILE, SCREEN_SIZES.TABLET].forEach(size => {
    test(`should show hamburger menus for ${size} screen size that opens to show links`, () => {
      render(<PublicInfoHeader classes={{}} screenSize={size} />);

      userEvent.click(screen.getByTestId("delicious-menu"));
      expectHeaderMenuButtonsToExist();
    });
  });

  test("should show menu buttons on the header itself (no menu) when the screen size is desktop", () => {
    render(<PublicInfoHeader classes={{}} screenSize={SCREEN_SIZES.DESKTOP} />);
    expectHeaderMenuButtonsToExist();
  });
});
