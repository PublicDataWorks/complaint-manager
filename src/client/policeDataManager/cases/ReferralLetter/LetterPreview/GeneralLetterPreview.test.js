import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import {
  CASE_STATUS,
  EDIT_STATUS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import GeneralLetterPreview from "./GeneralLetterPreview";
import nock from "nock";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import SharedSnackbarContainer from "../../../shared/components/SharedSnackbarContainer";
import { push } from "connected-react-router";
import axios from "axios";

describe("GeneralLetterPreview", () => {
  let caseId, letterId, dispatchSpy;

  beforeEach(() => {
    caseId = "1";
    letterId = "1";

    nock("http://localhost")
      .get(`/api/cases/${caseId}/letters/${letterId}/preview`)
      .reply(200, {
        addresses: {
          recipient: "Billy Bob",
          recipientAddress: "123 Missing Link Road",
          sender: "Sally McSally",
          transcribedBy: ""
        },
        draftFilename: "draft_filename.pdf",
        editStatus: EDIT_STATUS.EDITED,
        lastEdited: null,
        letterHtml: "This is some HTML"
      });

    const store = createConfiguredStore();

    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        nextStatus: CASE_STATUS.READY_FOR_REVIEW
      })
    );
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.SETUP_LETTER] }
    });

    dispatchSpy = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <Router>
          <GeneralLetterPreview
            match={{
              params: {
                id: caseId,
                letterId: letterId
              }
            }}
          />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  test("should render correct preview data", async () => {
    expect(await screen.findByText("This is some HTML")).toBeInTheDocument;
    expect((await screen.findByTestId("recipient-field")).value).toEqual(
      "Billy Bob"
    );
    expect((await screen.findByTestId("sender-field")).value).toEqual(
      "Sally McSally"
    );
  });

  test("should call edit letter addresses when return to case button is clicked", async () => {
    const editAddressCall = nock("http://localhost")
      .put(`/api/cases/${caseId}/letters/${letterId}/addresses`, {
        recipient: "Dirk Gently",
        recipientAddress: "4 W Peckender St.",
        sender: "Richard McDuff",
        transcribedBy: "Someone who doesn't work here"
      })
      .reply(200, {});

    const recipientField = await screen.findByTestId("recipient-field");
    userEvent.clear(recipientField);
    userEvent.type(recipientField, "Dirk Gently");

    const recipientAddressField = screen.getByTestId("recipient-address-field");
    userEvent.clear(recipientAddressField);
    userEvent.type(recipientAddressField, "4 W Peckender St.");

    const senderField = screen.getByTestId("sender-field");
    userEvent.clear(senderField);
    userEvent.type(senderField, "Richard McDuff");

    const transcribedField = screen.getByTestId("transcribed-by-field");
    userEvent.clear(transcribedField);
    userEvent.type(transcribedField, "Someone who doesn't work here");

    userEvent.click(screen.getByTestId("save-and-return-to-case-link"));

    expect(await screen.findByText("Letter was successfully updated"))
      .toBeInTheDocument;
    expect(editAddressCall.isDone()).toBe(true);
  });

  test("should call axios put request on click to update letter", async () => {
    const axiosSpy = jest.spyOn(axios, "put").mockReturnValue(
      Promise.resolve({
        status: 200,
        statusText: "OK",
        data: {},
        headers: {},
        config: {}
      })
    );
    userEvent.click(await screen.findByTestId("generate-letter-button"));

    expect(axiosSpy).toHaveBeenCalledWith(
      `/api/cases/${caseId}/letters/${letterId}/addresses`,
      expect.anything()
    );

    await new Promise(resolve => {
      setTimeout(() => {
        expect(axiosSpy).toHaveBeenCalledWith(
          `/api/cases/${caseId}/letters/${letterId}`,
          expect.anything()
        );
        resolve();
      }, 500);
    });
  });
});
