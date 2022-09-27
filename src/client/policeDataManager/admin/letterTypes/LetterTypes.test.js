import React from "react";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import createConfiguredStore from "../../../createConfiguredStore";
import SharedSnackbarContainer from "../../shared/components/SharedSnackbarContainer";
import LetterTypes from "./LetterTypes";
import {
  CASE_STATUSES_RETRIEVED,
  GET_SIGNERS
} from "../../../../sharedUtilities/constants";

describe("Letter Types Card", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock("http://localhost")
      .get("/api/letter-types")
      .reply(200, [
        {
          id: 1,
          type: "REFERRAL",
          template: "<section>Hello World</section>",
          hasEditPage: true,
          requiresApproval: true,
          defaultSender: {
            name: "Billy",
            nickname: "bill@billy.bil"
          },
          requiredStatus: "Active"
        },
        {
          id: 2,
          type: "COMPLAINANT",
          template: "",
          editableTemplate: "editable template",
          hasEditPage: true,
          requiresApproval: null,
          defaultSender: {
            name: "Kate",
            nickname: "Kate@k.com"
          },
          requiredStatus: "Initial"
        }
      ]);

    const store = createConfiguredStore();
    store.dispatch({
      type: GET_SIGNERS,
      payload: [
        { name: "Billy", nickname: "bill@billy.bil" },
        { name: "ABC Pest and Lawn", nickname: "abcpestandlawn@gmail.com" }
      ]
    });

    store.dispatch({
      type: CASE_STATUSES_RETRIEVED,
      payload: [{ name: "Active" }, { name: "Closed" }]
    });

    render(
      <Provider store={store}>
        <Router>
          <LetterTypes />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  test("should render title and letter types", async () => {
    expect(screen.getByText("Letters")).toBeInTheDocument;
    expect(await screen.findByText("REFERRAL")).toBeInTheDocument;
    expect(await screen.findByText("COMPLAINANT")).toBeInTheDocument;
  });

  test("should render Requires Approval and Is Editable column", async () => {
    expect(
      await screen.findAllByTestId("requires-approval-label")
    ).toBeTruthy();
    expect(await screen.findAllByTestId("is-editable-label")).toBeTruthy();
  });

  test("should render Default Sender column", async () => {
    expect(await screen.findAllByTestId("default-sender-label")).toBeTruthy();
    expect(await screen.findByText("Billy")).toBeInTheDocument;
    expect(await screen.findByText("Kate")).toBeInTheDocument;
  });

  test("should render Required Status column", async () => {
    expect(await screen.findAllByTestId("required-status-label")).toBeTruthy();
    expect(await screen.findByText("Active")).toBeInTheDocument;
    expect(await screen.findByText("Initial")).toBeInTheDocument;
  });

  test("should render template when click on dropdown", async () => {
    const letterTypeRow = await screen.findAllByTestId("letter-type-label");
    userEvent.click(letterTypeRow[0]);
    expect(await screen.findAllByTestId("template-label")).toBeTruthy();
  });

  test("should display editable template when hasEditPage is true", async () => {
    const letterTypeRow = await screen.findAllByTestId("letter-type-label");
    userEvent.click(letterTypeRow[1]);
    expect(await screen.findAllByTestId("body-template-label")).toBeTruthy();
    expect(await screen.findByText("editable template")).toBeInTheDocument;
  });
});
