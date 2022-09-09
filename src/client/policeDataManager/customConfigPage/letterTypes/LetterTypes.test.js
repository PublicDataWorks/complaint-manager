import React from "react";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../createConfiguredStore";
import SharedSnackbarContainer from "../../shared/components/SharedSnackbarContainer";
import LetterTypes from "./LetterTypes";

describe("Letter Types Card", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock("http://localhost")
      .get("/api/letter-types")
      .reply(200, [
        {
          id: 1,
          type: "REFERRAL",
          template: "",
          editableTemplate: "",
          hasEditPage: null,
          requiresApproval: true
        },
        {
          id: 2,
          type: "COMPLAINANT",
          template: "",
          editableTemplate: "editable template",
          hasEditPage: null,
          requiresApproval: null
        }
      ]);

    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <LetterTypes />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  test("should render title and letter types", async () => {
    expect(screen.getByText("Letter Types")).toBeInTheDocument;
    expect(await screen.findByText("REFERRAL")).toBeInTheDocument;
    expect(await screen.findByText("COMPLAINANT")).toBeInTheDocument;
  });

  test("should render Requires Approval column", async () => {
    expect(
      await screen.findAllByTestId("requires-approval-label")
    ).toBeTruthy();
  });
});
