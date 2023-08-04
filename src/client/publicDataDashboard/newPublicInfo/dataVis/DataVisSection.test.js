import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import DataVisSection from "./DataVisSection";

describe("Data Vis Section", () => {
  [(SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(
    size => {
      test(`should show Myths and Facts title on page for ${size} view`, () => {
        render(<DataVisSection classes={{}} screenSize={size} />);

        expect(screen.getByText("Hawaii Prison Profile Dashboard"))
          .toBeInTheDocument;
      });

      test(`should not show title of category not selected for ${size} view`, () => {
        render(<DataVisSection classes={{}} screenSize={size} />);

        userEvent.click(screen.getByTestId("category-dropdown-button"));
        expect(screen.getByText("Facility Capacity")).toBeInTheDocument;

        userEvent.click(screen.getByTestId("Facility Capacity-selection"));
        expect(screen.findByText("Demographic Breakdown")).not
          .toBeInTheDocument;
      });
    }
  );

  [(SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(size => {
    test(`should be able to click on the category button in ${size} and dropdown opens`, () => {
      render(<DataVisSection classes={{}} screenSize={size} />);

      userEvent.click(screen.getByTestId("category-dropdown-button"));
      expect(screen.getByText("Facility Capacity")).toBeInTheDocument;

      userEvent.click(screen.getByTestId("Facility Capacity-selection"));
      expect(screen.getByText("Facility Overcrowding Rates")).toBeInTheDocument;
    });
  });
});
