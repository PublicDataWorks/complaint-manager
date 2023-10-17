import React from "react";
import "@testing-library/jest-dom";
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
            "Serious overcrowding attributes to inhumane conditions, specifically for jails."
          )
        ).toBeInTheDocument();
        expect(screen.getByText("80%")).toBeInTheDocument();
        expect(screen.getByText("93%")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Average rate across the country is 40-50% for those in secure cell settings. Secure settings create serious lack of movement and out-of-cell time for those in custody."
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Nearly 65% of people in custody are in secure cell settings."
          )
        ).toBeInTheDocument();
        expect(screen.getByText("Capacity in Prisons")).toBeInTheDocument();
        expect(screen.getByText("156%")).toBeInTheDocument();
        expect(screen.getByText("Capacity in Jails")).toBeInTheDocument();
      });
    }
  );
});
