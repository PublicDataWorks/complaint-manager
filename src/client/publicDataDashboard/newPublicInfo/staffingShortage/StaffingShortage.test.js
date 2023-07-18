import React from "react";
import { screen, render } from "@testing-library/react";
import StaffingShortage from "./StaffingShortage";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

describe("Staffing Shortages", () => {
  [SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE].forEach(
    size => {
      test(`should show staffing shortages text on page`, () => {
        render(<StaffingShortage classes={{}} screenSize={size} />);

        expect(
          screen.getByText(
            "Serious overcrowding attributing to inhumane conditions, specifically for jails."
          )
        ).toBeInTheDocument;
        expect(screen.getByText("80%")).toBeInTheDocument;
      });
    }
  );
});
