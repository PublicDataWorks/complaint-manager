import React from "react";
import { render, screen } from "@testing-library/react";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
import ValuesSection, { TEXT, TITLE } from "./ValuesSection";

describe("ValuesSection", () => {
  Object.values(SCREEN_SIZES).forEach(size => {
    describe(`${size} screen size`, () => {
      beforeEach(() => {
        render(<ValuesSection screenSize={size} />);
      });

      test("should display the title", () => {
        expect(screen.getByText(TITLE)).toBeInTheDocument;
      });

      test("should display the text", () => {
        expect(screen.getByText(TEXT)).toBeInTheDocument;
      });
    });
  });
});
