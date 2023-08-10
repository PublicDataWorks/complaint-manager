import React from "react";
import { screen, render } from "@testing-library/react";
import PublicInfoFooter from "./PublicInfoFooter";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

describe("Public Info Footer", () => {
  [(SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET, SCREEN_SIZES.MOBILE)].forEach(
    size => {
      test(`should show Contributor Partner title on page footer for ${size} view`, () => {
        render(<PublicInfoFooter classes={{}} screenSize={size} />);
        expect(screen.getByText("Contributor Partner")).toBeInTheDocument;
      });

      test(`should show partner links on page footer for ${size} view`, () => {
        render(<PublicInfoFooter classes={{}} screenSize={size} />);
        expect(screen.getByText("About")).toBeInTheDocument;
        expect(screen.getByText("Contact Us")).toBeInTheDocument;
        expect(screen.getByText("Terms of Use")).toBeInTheDocument;
        expect(screen.getByText("Accessability")).toBeInTheDocument;
      });
    }
  );

  [(SCREEN_SIZES.DESKTOP, SCREEN_SIZES.TABLET)].forEach(size => {
    test(`should show Contributor Partner description on page footer for ${size} view`, () => {
      render(<PublicInfoFooter classes={{}} screenSize={size} />);
      expect(
        screen.getByText(
          "Thoughtworks a leading global technology consultancy that enables enterprises and technology disruptors across the globe to thrive as modern digital businesses. We leverage our vast experience to improve our clients’ ability to respond to change; utilize data assets; create adaptable technology platforms; and rapidly design, deliver and evolve exceptional digital products and experiences at scale."
        )
      ).toBeInTheDocument;
    });
  });
});
