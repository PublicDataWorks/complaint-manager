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
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";

jest.mock("../thunks/editReferralLetterAddresses", () =>
  jest.fn((caseId, values, redirectUrl, successCallback, failureCallback) => {
    if (successCallback) {
      successCallback();
    }
    return {
      type: "SOMETHING",
      caseId,
      values,
      redirectUrl
    };
  })
);

describe("GeneralLetterPreview", () => {
  let caseId, letterId, dispatchSpy;

  beforeEach(() => {
    caseId = "1";
    letterId = "1";

    nock("http://localhost")
      .get(`/api/cases/${caseId}/letter/${letterId}/preview`)
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

  test("should update address fields when the back to case button is clicked", async () => {
    expect(await screen.findByText("This is some HTML")).toBeInTheDocument;
    let recipientField = await screen.findByTestId("recipient-field");

    userEvent.clear(recipientField);
    userEvent.type(recipientField, "Arthur Conan Doyle");
    userEvent.click(screen.getByTestId("save-and-return-to-case-link"));

    expect(editReferralLetterAddresses).toHaveBeenCalledWith(
      caseId,
      {
        recipient: "Arthur Conan Doyle",
        recipientAddress: "123 Missing Link Road",
        sender: "Sally McSally",
        transcribedBy: ""
      },
      `/cases/${caseId}`,
      undefined,
      undefined
    );
  });
});
