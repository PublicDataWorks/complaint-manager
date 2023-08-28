import React from "react";
import { screen, render } from "@testing-library/react";
import PublicInfoMenu from "./PublicInfoMenu";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

const expectMenuLinksToExist = () => {
  expect(screen.getByText("About")).toBeInTheDocument;
  expect(screen.getByText("Public Data")).toBeInTheDocument;
  expect(screen.getByText("Myths and Facts")).toBeInTheDocument;
  expect(screen.getByText("Issues")).toBeInTheDocument;
};

const expectMenuLinksToNotExist = () => {
  expect(screen.queryByText("About")).toBeNull();
  expect(screen.queryByText("Public Data")).toBeNull();
  expect(screen.queryByText("Myths and Facts")).toBeNull();
  expect(screen.queryByText("Issues")).toBeNull();
};

describe("Public Info Menu", () => {
  [SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET].forEach(size => {
    test(`should show navigation menu for ${size} screen size`, () => {
      render(<PublicInfoMenu classes={{}} screenSize={size} />);
      expectMenuLinksToExist();
    });
  });

  test("should not show navigation menu when the screen size is mobile", () => {
    render(<PublicInfoMenu classes={{}} screenSize={SCREEN_SIZES.MOBILE} />);
    expectMenuLinksToNotExist();
  });
});
