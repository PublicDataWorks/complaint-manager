import React from "react";
import { render, screen } from "@testing-library/react";
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

describe("GeneralLetterPreview", () => {
  let caseId, letterId;

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
});
