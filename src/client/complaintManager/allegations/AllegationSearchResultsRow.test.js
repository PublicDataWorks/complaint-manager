import { shallow } from "enzyme/build/index";
import React from "react";
import { AllegationSearchResultsRow } from "./AllegationSearchResultsRow";
import AllegationDetailsForm from "./AllegationDetailsForm";

describe("AllegationSearchResultsRow", function() {
  const classes = {};
  const allegation = {
    id: 5,
    rule: "rule",
    paragraph: "paragraph",
    directive: "directive"
  };

  test("should display select allegation button and not display form when search results rendered", () => {
    const allegationSearchResultsRow = shallow(
      <AllegationSearchResultsRow classes={classes} allegation={allegation} />
    );

    expect(
      allegationSearchResultsRow
        .find('[data-test="selectAllegationButton"]')
        .exists()
    ).toBeTruthy();
    expect(
      allegationSearchResultsRow.find(AllegationDetailsForm).exists()
    ).toBeFalsy();
  });

  test("should display form and hide select allegation button when select button clicked", () => {
    const allegationSearchResultsRow = shallow(
      <AllegationSearchResultsRow classes={classes} allegation={allegation} />
    );

    const selectButton = allegationSearchResultsRow.find(
      '[data-test="selectAllegationButton"]'
    );
    selectButton.simulate("click");

    expect(
      allegationSearchResultsRow
        .find('[data-test="selectAllegationButton"]')
        .exists()
    ).toBeFalsy();

    expect(
      allegationSearchResultsRow.find(AllegationDetailsForm).exists()
    ).toBeTruthy();
  });
});
