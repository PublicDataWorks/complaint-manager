import React from "react";
import { shallow } from "enzyme/build/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import { AllegationSearchResultsRow } from "./AllegationSearchResultsRow";
import AllegationDetailsForm from "./AllegationDetailsForm";
import createConfiguredStore from "../../createConfiguredStore";
import { ALLEGATION_SEVERITY } from "../../../sharedUtilities/constants";
import SharedSnackbarContainer from "../shared/components/SharedSnackbarContainer";

describe("AllegationSearchResultsRow", function () {
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
        .find('[data-testid="selectAllegationButton"]')
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
      '[data-testid="selectAllegationButton"]'
    );
    selectButton.simulate("click");

    expect(
      allegationSearchResultsRow
        .find('[data-testid="selectAllegationButton"]')
        .exists()
    ).toBeFalsy();

    expect(
      allegationSearchResultsRow.find(AllegationDetailsForm).exists()
    ).toBeTruthy();
  });

  test("should call createOfficerAllegation with appropriate values on submit after selecting", async () => {
    nock("http://localhost")
      .post("/api/cases/1/cases-officers/2/officers-allegations")
      .reply(200, {});
    const store = createConfiguredStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AllegationSearchResultsRow
            classes={classes}
            allegation={allegation}
            caseId={"1"}
            caseOfficerId={"2"}
          />
          <SharedSnackbarContainer />
        </BrowserRouter>
      </Provider>
    );

    userEvent.click(screen.getByText("Select"));
    userEvent.click(screen.getByTestId("allegation-details-field"));
    userEvent.type(
      screen.getByTestId("allegation-details-input"),
      "some details"
    );

    userEvent.click(screen.getByTestId("allegation-severity-input"));
    userEvent.click(await screen.findByText(ALLEGATION_SEVERITY.MEDIUM));

    userEvent.click(screen.getByTestId("allegation-submit-btn"));

    expect(await screen.findByText("Allegation was successfully added"))
      .toBeInTheDocument;
  });
});
