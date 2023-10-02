import React from "react";
import { render, screen } from "@testing-library/react";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
import ValuesSection, { TEXT, VALUES } from "./ValuesSection";
import "@testing-library/jest-dom";

describe("ValuesSection", () => {
  Object.values(SCREEN_SIZES).forEach(size => {
    describe(`${size} screen size`, () => {
      beforeEach(() => {
        render(<ValuesSection screenSize={size} />);
      });

      test("should display the text", () => {
        expect(screen.getByText(TEXT)).toBeInTheDocument();
      });

      test("should display all the values", () => {
        VALUES.forEach(value => {
          expect(screen.getByText(value.name)).toBeInTheDocument();
          expect(screen.getByText(value.subtext)).toBeInTheDocument();
        });
      });
    });
  });
});
