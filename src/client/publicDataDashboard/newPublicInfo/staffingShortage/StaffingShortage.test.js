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
        expect(screen.getByText("93%")).toBeInTheDocument;
        expect(
          screen.getByText(
            "Average rate across the country is 40-50%. Serious lack of movement and out-of-cell time for those in custody."
          )
        ).toBeInTheDocument;
        expect(
          screen.getByText(
            "Nearly 80% of People in Custody Are in Secure Settings"
          )
        ).toBeInTheDocument;
        expect(screen.getByText("Capacity in Prisons")).toBeInTheDocument;
        expect(screen.getByText("156%")).toBeInTheDocument;
        expect(screen.getByText("Capacity in Jails")).toBeInTheDocument;
      });
    }
  );
});
