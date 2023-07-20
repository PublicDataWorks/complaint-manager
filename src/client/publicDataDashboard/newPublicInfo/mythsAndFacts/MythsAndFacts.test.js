import React from "react";
import { screen, render } from "@testing-library/react";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import MythsAndFacts from "./MythsAndFacts";
import userEvent from "@testing-library/user-event";

describe("Myths and Facts", () => {
  describe("Staffing Shortages", () => {
    [(SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(
      size => {
        test(`should show Myths and Facts title on page for ${size} view`, () => {
          render(<MythsAndFacts classes={{}} screenSize={size} />);

          expect(screen.getByText("MYTHS AND FACTS")).toBeInTheDocument;
        });

        test(`should show categories on page for ${size} view`, () => {
          render(<MythsAndFacts classes={{}} screenSize={size} />);

          expect(screen.getByText("Overcrowding")).toBeInTheDocument;
          expect(screen.getByText("Probation")).toBeInTheDocument;
          expect(screen.getByText("Bail Reform")).toBeInTheDocument;
          expect(screen.getByText("Recidivism")).toBeInTheDocument;
          expect(screen.getByText("Rehabilitative Programs")).toBeInTheDocument;
        });

        test(`should be able to click on an category in ${size} view and open the accordion`, () => {
          render(<MythsAndFacts classes={{}} screenSize={size} />);

          userEvent.click(screen.getByTestId("Overcrowding"));
          expect(
            screen.getByText(
              "Prison overcrowding is primarily caused by an increase in crime rates."
            )
          ).toBeInTheDocument;
        });
      }
    );
  });
});
