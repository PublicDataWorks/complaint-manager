import React from "react";
import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import DataVisSection from "./DataVisSection";

describe("Data Vis Section", () => {
  [(SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(
    size => {
      test(`should show Hawaii prison profile dashboard title on page for ${size} view`, () => {
        render(<DataVisSection classes={{}} screenSize={size} />);

        expect(
          screen.getByText("Hawaii Prison Profile Dashboard")
        ).toBeInTheDocument();
      });

      test(`should not show title of category not selected for ${size} view`, () => {
        render(<DataVisSection classes={{}} screenSize={size} />);

        userEvent.click(screen.getByTestId("category-dropdown-button"));
        userEvent.click(screen.getByTestId("Facility Capacity-selection"));

        expect(() => {
          screen.getByText("Demographic Breakdown");
        }).toThrow();
        expect(
          screen.queryByText("Facility Overcrowding Rates")
        ).toBeInTheDocument();
      });
    }
  );

  [(SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(size => {
    test(`should be able to click on the category button in ${size} and dropdown opens`, () => {
      render(<DataVisSection classes={{}} screenSize={size} />);

      userEvent.click(screen.getByTestId("category-dropdown-button"));
      expect(screen.getByText("Facility Capacity")).toBeInTheDocument();
    });
  });

  [(SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(size => {
    test(`should show state population percentages on page when user clicks "Demographics" for ${size} view`, () => {
      render(<DataVisSection classes={{}} screenSize={size} />);
      userEvent.click(screen.getByTestId("category-dropdown-button"));
      userEvent.click(screen.getByTestId("Demographics-selection"));

      expect(screen.getByText("Demographic Breakdown")).toBeInTheDocument();
      expect(screen.getByText("White")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
      expect(screen.getByText("22%")).toBeInTheDocument();
    });
  });

  test(`should show state population percentages on page when user clicks "Demographics" for desktop view`, () => {
    render(<DataVisSection classes={{}} screenSize={SCREEN_SIZES.DESKTOP} />);

    userEvent.click(screen.getByTestId("Demographics-selection"));

    expect(screen.getByText("Demographic Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Black")).toBeInTheDocument();
    expect(screen.getAllByText("2%")[0]).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
  });

  describe("Facility Overcrowding Rates", () => {
    test(`should show facility overcrowding rates bar graph on page when user clicks "Facility Capacity" for desktop view`, () => {
      render(<DataVisSection classes={{}} screenSize={SCREEN_SIZES.DESKTOP} />);

      userEvent.click(screen.getByTestId("Facility Capacity-selection"));

      const barGraph = screen.getByTestId("facility-graph");
      expect(barGraph).toBeInTheDocument();
    });

    [(SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(size => {
      test(`should show facility overcrowding rates bar graph on page when user clicks "Facility Capacity" for ${size}`, () => {
        render(<DataVisSection classes={{}} screenSize={size} />);

        userEvent.click(screen.getByTestId("category-dropdown-button"));
        userEvent.click(screen.getByTestId("Facility Capacity-selection"));

        const barGraph = screen.getByTestId("facility-graph");
        expect(barGraph).toBeInTheDocument();
      });
    });
  });
});
