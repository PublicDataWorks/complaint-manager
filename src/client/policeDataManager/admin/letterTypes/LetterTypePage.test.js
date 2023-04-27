import React from "react";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import createConfiguredStore from "../../../createConfiguredStore";
import SharedSnackbarContainer from "../../shared/components/SharedSnackbarContainer";
import {
  CASE_STATUSES_RETRIEVED,
  CIVILIAN_INITIATED,
  GET_COMPLAINT_TYPES_SUCCEEDED,
  GET_SIGNERS,
  RANK_INITIATED,
  SET_LETTER_TYPE_TO_EDIT
} from "../../../../sharedUtilities/constants";
import LetterTypePage from "./LetterTypePage";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";

describe("LetterTypePage", () => {
  let store;

  beforeEach(() => {
    store = createConfiguredStore();

    store.dispatch({
      type: GET_SIGNERS,
      payload: [
        { name: "Billy", nickname: "bill@billy.bil" },
        { name: "ABC Pest and Lawn", nickname: "abcpestandlawn@gmail.com" },
        { name: "Rob Ot", nickname: "beeboop@gmail.com" }
      ]
    });

    store.dispatch({
      type: CASE_STATUSES_RETRIEVED,
      payload: [{ name: "Initial" }, { name: "Active" }, { name: "Closed" }]
    });

    store.dispatch({
      type: GET_COMPLAINT_TYPES_SUCCEEDED,
      payload: [{ name: RANK_INITIATED }, { name: CIVILIAN_INITIATED }]
    });

    store.dispatch(
      getFeaturesSuccess({
        chooseDefaultRecipientFeature: true
      })
    );
  });

  describe("Edit Letter Type", () => {
    beforeEach(() => {
      store.dispatch({
        type: SET_LETTER_TYPE_TO_EDIT,
        payload: {
          id: 1,
          type: "REFERRAL",
          template: "<section>Hello World {{caseReference}}</section>",
          hasEditPage: true,
          requiresApproval: true,
          defaultSender: {
            name: "Billy",
            nickname: "bill@billy.bil"
          },
          defaultRecipient: "The Primary Complainant",
          defaultRecipientAddress: "Their Address",
          requiredStatus: "Active",
          complaintTypes: []
        }
      });

      render(
        <Provider store={store}>
          <Router>
            <LetterTypePage />
            <SharedSnackbarContainer />
          </Router>
        </Provider>
      );
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

    test("should call edit letter type endpoint when save is clicked", async () => {
      const payload = {
        type: "NEW TYPE",
        template: /.+/,
        hasEditPage: false,
        requiresApproval: false,
        defaultSender: "abcpestandlawn@gmail.com",
        defaultRecipient: "The Primary Complainant",
        defaultRecipientAddress: "Their Address",
        requiredStatus: "Closed",
        complaintTypes: []
      };

      const editCall = nock("http://localhost")
        .put("/api/letter-types/1", payload)
        .reply(200, payload);

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
    });

    test("should include complaint types on edit request when complaint types are selected", async () => {
      const payload = {
        type: "REFERRAL",
        template: /.+/,
        hasEditPage: true,
        requiresApproval: true,
        defaultSender: "bill@billy.bil",
        defaultRecipient: "The Primary Complainant",
        defaultRecipientAddress: "Their Address",
        requiredStatus: "Active",
        complaintTypes: [RANK_INITIATED]
      };

      const editCall = nock("http://localhost")
        .put("/api/letter-types/1", payload)
        .reply(200, payload);

      userEvent.click(screen.getByLabelText(CIVILIAN_INITIATED));
      userEvent.click(screen.getByText("Save"));

      expect(await screen.findByText("Successfully edited letter type"))
        .toBeInTheDocument;
      expect(editCall.isDone()).toBeTrue();
    });

    describe("Display Example HTML", () => {
      test("should display Preview button", () => {
        expect(screen.getByText("Preview")).toBeInTheDocument;
      });

      test("should generate html from template when Preview button is clicked", async () => {
        nock("http://localhost")
          .post("/api/example-letter-preview")
          .reply(200, { html: "<section>Hello World CC2022-0001" });

        userEvent.click(screen.getByText("Preview"));
        expect(await screen.findByTestId("template-preview")).toBeInTheDocument;
      });
    });
  });

  describe("Add Letter Type", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <Router>
            <LetterTypePage />
            <SharedSnackbarContainer />
          </Router>
        </Provider>
      );
    });

    test("should add a new letter type", async () => {
      const addCall = nock("http://localhost")
        .post("/api/letter-types")
        .reply(200, {
          type: "NEW NEW TYPE",
          template: "<section>Hello World</section>",
          hasEditPage: false,
          requiresApproval: false,
          defaultSender: "beeboop@gmail.com",
          defaultRecipient: "The Primary Complainant",
          defaultRecipientAddress: "Their Address",
          requiredStatus: "Initial"
        });

      userEvent.click(screen.getByTestId("letter-type-input"));
      userEvent.clear(screen.getByTestId("letter-type-input"));
      userEvent.type(screen.getByTestId("letter-type-input"), "NEW NEW TYPE");

      userEvent.click(screen.getByTestId("default-sender-dropdown"));
      userEvent.click(screen.getByText("Rob Ot"));

      userEvent.click(screen.getByTestId("required-status-dropdown"));
      userEvent.click(screen.getByText("Initial"));

      userEvent.click(screen.getByText("Primary Complainant"));

      userEvent.click(screen.getByText("Save"));

      expect(await screen.findByText("Successfully added letter type"))
        .toBeInTheDocument;
      expect(addCall.isDone()).toBeTrue();
    });

    test("should have default recipient section with corresponding radio buttons", () => {
      expect(screen.getByText("Default Recipient")).toBeInTheDocument;
      expect(screen.getByText("Primary Complainant")).toBeInTheDocument;
      expect(screen.getByText("Each Complainant")).toBeInTheDocument;
      expect(screen.getByText("Other")).toBeInTheDocument;
    });

    test("should render recipient name and address fields when Other is selected", () => {
      expect(screen.queryByText("Recipient Name")).toBeFalsy();
      expect(screen.queryByText("Recipient Address")).toBeFalsy();

      userEvent.click(screen.getByText("Other"));
      expect(screen.getByTestId("recipient-name-input")).toBeInTheDocument;
      expect(screen.getByTestId("recipient-address-input")).toBeInTheDocument;
    });
  });
});
