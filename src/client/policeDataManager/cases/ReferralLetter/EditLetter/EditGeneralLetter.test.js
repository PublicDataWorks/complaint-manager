import React from "react";
import "@testing-library/jest-dom";
import nock from "nock";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { change, initialize } from "redux-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import {
  EDIT_LETTER_HTML_FORM,
  EDIT_STATUS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import createConfiguredStore from "../../../../createConfiguredStore";
import EditGeneralLetter from "./EditGeneralLetter";
import SharedSnackbarContainer from "../../../shared/components/SharedSnackbarContainer";

jest.mock("../../../shared/components/RichTextEditor/RichTextEditor");

describe("Edit General Letter Html", () => {
  let store, dispatchSpy;

  const caseId = "1";
  const letterId = "1";
  const initialLetterHtml = "<div>beware of the vampires</div>";

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

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
        letterHtml: "This is some HTML",
        caseDetails: {
          caseReference: "CASE-104"
        }
      });

    nock("http://localhost")
      .put(`/api/cases/${caseId}/letters/${letterId}/addresses`, {
        recipient: "Dirk Gently",
        recipientAddress: "4 W Peckender St.",
        sender: "Richard McDuff",
        transcribedBy: "Someone who doesn't work here"
      })
      .reply(200, {});

    store.dispatch(getCaseDetailsSuccess({ id: caseId }));

    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.SETUP_LETTER] }
    });

    store.dispatch(
      initialize(EDIT_LETTER_HTML_FORM, {
        editedLetterHtml: "This is some HTML"
      })
    );

    render(
      <Provider store={store}>
        <Router>
          <EditGeneralLetter
            match={{ params: { id: caseId, letterId: letterId } }}
          />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("should be able to save the edited the letter", async () => {
    nock("http://localhost/")
      .put(
        `/api/cases/${caseId}/letters/${letterId}/content`,
        "<div>beware of the vampires</div>"
      )
      .reply(200, {});

    const axiosSpy = jest.spyOn(axios, "put").mockReturnValue(
      Promise.resolve({
        status: 200,
        statusText: "OK",
        data: {},
        headers: {},
        config: {}
      })
    );

    store.dispatch(
      change(EDIT_LETTER_HTML_FORM, "editedLetterHtml", initialLetterHtml)
    );

    userEvent.click(await screen.findByTestId("save-button"));

    expect(axiosSpy).toHaveBeenCalledWith(
      `/api/cases/${caseId}/letters/${letterId}/content`,
      expect.anything()
    );

    await new Promise(resolve => {
      setTimeout(() => {
        expect(axiosSpy).toHaveBeenCalledWith(
          `/api/cases/${caseId}/letters/${letterId}/content`,
          expect.anything()
        );
        resolve();
      }, 500);
    });

    expect(
      await screen.findByText("Letter was successfully updated")
    ).toBeInTheDocument();
  });
});
