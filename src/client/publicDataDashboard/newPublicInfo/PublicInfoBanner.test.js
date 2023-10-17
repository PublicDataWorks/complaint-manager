import React from "react";
import { screen, render } from "@testing-library/react";
import PublicInfoBanner, { SUBTEXT, BUTTON_TEXT } from "./PublicInfoBanner";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
import "@testing-library/jest-dom";

describe("Banner", () => {
  Object.values(SCREEN_SIZES).forEach(size => {
    test(`Expect Banner to contain text for ${size}`, () => {
      render(<PublicInfoBanner classes={{}} screenSize={size} />);
      expect(
        screen.getByText("Empowering Transparency, Inspiring Change")
      ).toBeInTheDocument();
    });
    test(`Expect Banner to contain subtext for ${size}`, () => {
      render(<PublicInfoBanner classes={{}} screenSize={size} />);
      expect(screen.getByText(SUBTEXT)).toBeInTheDocument();
    });
    test(`Expect Banner to contain button for ${size}`, () => {
      render(<PublicInfoBanner classes={{}} screenSize={size} />);
      expect(screen.getByText(BUTTON_TEXT)).toBeInTheDocument();
    });
  });
});
