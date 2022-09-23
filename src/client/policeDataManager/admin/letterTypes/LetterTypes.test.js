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

  describe("edit letter type", () => {
    beforeEach(async () => {
      const editBtns = await screen.findAllByTestId("edit-letter-type-btn");
      userEvent.click(editBtns[0]);
      await screen.findByText("Edit Letter Type");
    });

    test("should display existing data on dialog inputs", () => {
      expect(screen.getByTestId("letter-type-input").value).toEqual("REFERRAL");
      expect(
        screen.getByTestId("requires-approval-checkbox").checked
      ).toBeTrue();
      expect(screen.getByTestId("edit-page-checkbox").checked).toBeTrue();
      expect(screen.getByTestId("default-sender-dropdown").value).toEqual(
        "Billy"
      );
      expect(screen.getByTestId("required-status-dropdown").value).toEqual(
        "Active"
      );
    });

    test("should close dialog when cancel is clicked", () => {
      userEvent.click(screen.getByText("Cancel"));
      expect(screen.queryAllByText("Cancel")).toHaveLength(0);
    });

    test("should call edit letter type endpoint when save is clicked", async () => {
      const editCall = nock("http://localhost")
        .put("/api/letter-types/1")
        .reply(200, {
          id: 1,
          type: "NEW TYPE",
          template: "<section>Hello World</section>",
          hasEditPage: false,
          requiresApproval: false,
          defaultSender: "abcpestandlawn@gmail.com",
          requiredStatus: "Closed"
        });

      userEvent.click(screen.getByTestId("letter-type-input"));
      userEvent.clear(screen.getByTestId("letter-type-input"));
      userEvent.type(screen.getByTestId("letter-type-input"), "NEW TYPE");

      userEvent.click(screen.getByTestId("requires-approval-checkbox"));
      userEvent.click(screen.getByTestId("edit-page-checkbox"));

      userEvent.click(screen.getByTestId("default-sender-dropdown"));
      userEvent.click(screen.getByText("ABC Pest and Lawn"));

      userEvent.click(screen.getByTestId("required-status-dropdown"));
      userEvent.click(screen.getByText("Closed"));

      userEvent.click(screen.getByText("Save"));

      expect(await screen.findByText("Successfully edited letter type"))
        .toBeInTheDocument;
      expect(editCall.isDone()).toBeTrue();
      expect(screen.queryAllByText("Cancel")).toHaveLength(0);
    });
  });
});
