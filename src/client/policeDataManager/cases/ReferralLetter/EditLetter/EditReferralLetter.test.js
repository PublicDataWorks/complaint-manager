import createConfiguredStore from "../../../../createConfiguredStore";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { getReferralLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import EditReferralLetter from "./EditReferralLetter";
import editReferralLetterContent from "../thunks/editReferralLetterContent";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  EDIT_LETTER_HTML_FORM
} from "../../../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { push } from "connected-react-router";
import history from "../../../../history";
import { initialize } from "redux-form";
import userEvent from "@testing-library/user-event";

require("../../../testUtilities/MockMutationObserver");

jest.mock("../thunks/getReferralLetterPreview", () => () => ({
  type: "getReferralLetterPreview"
}));

jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "invalidCaseStatusRedirect",
  caseId
}));

jest.mock(
  "../thunks/editReferralLetterContent",
  () => (caseId, referralLetterHtml, url) => ({
    type: "editReferralLetterContent",
    caseId,
    referralLetterHtml,
    url
  })
);

jest.mock(
  "../../../shared/components/RichTextEditor/RichTextEditor",
  () => props =>
    (
      <input
        type="text"
        data-testid={props["data-testid"]}
        onChange={props.onChange}
        value={props.input.value}
      />
    )
);

describe("Edit Referral Letter Html", () => {
  let store, dispatchSpy, wrapper;

  const caseId = "102";
  const initialLetterHtml = "<p>Letter Preview HTML</p>";

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getReferralLetterPreviewSuccess(initialLetterHtml, {
        sender: "bob",
        recipient: "jane",
        recipientAddress: "jane's address",
        transcribedBy: "joe"
      })
    );
    store.dispatch(
      getCaseDetailsSuccess({
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        caseReference: "ABC-123-that'showeasylovecanbe"
      })
    );

    render(
      <Provider store={store}>
        <Router>
          <EditReferralLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("load letter preview html and set it on the quill editor when page is loaded", () => {
    store.dispatch(
      initialize(EDIT_LETTER_HTML_FORM, { editedLetterHtml: initialLetterHtml })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(getReferralLetterPreview(caseId));

    expect(screen.getByTestId("editLetterInput").value).toEqual(
      initialLetterHtml
    );
  });

  test("open cancel dialog when clicking cancel button only when letter is 'dirty'", () => {
    const cancelButton = screen.getByTestId("cancel-button");
    userEvent.click(cancelButton);

    expect(screen.queryAllByTestId("dialog-cancel-button")).toHaveLength(0);

    const input = screen.getByTestId("editLetterInput");
    userEvent.type(input, "testing");

    userEvent.click(cancelButton);

    expect(screen.getAllByTestId("dialog-cancel-button")).toHaveLength(1);
  });

  test("should redirect to letter-preview when clicking cancel button on 'pristine' letter", () => {
    const cancelButton = screen.getByTestId("cancel-button");
    userEvent.click(cancelButton);

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/letter/letter-preview`)
    );
  });

  test("open cancel dialog and do not save edits when clicking any stepper button only when letter is 'dirty'", () => {
    const statusStepper = screen.getByTestId("step-button-Review Case Details");
    userEvent.click(statusStepper);

    expect(screen.queryAllByTestId("dialog-cancel-button")).toHaveLength(0);

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/letter/review`)
    );

    const input = screen.getByTestId("editLetterInput");
    userEvent.type(input, "testing");

    userEvent.click(statusStepper);

    expect(screen.getAllByTestId("dialog-cancel-button")).toHaveLength(1);
  });

  test("open cancel dialog and not save edits when clicking back to case button only when letter is 'dirty'", () => {
    const backToCaseButton = screen.getByTestId("save-and-return-to-case-link");
    userEvent.click(backToCaseButton);

    expect(screen.queryAllByTestId("dialog-cancel-button")).toHaveLength(0);

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    expect(dispatchSpy).toHaveBeenCalledWith(push(`/cases/${caseId}`));

    const input = screen.getByTestId("editLetterInput");
    userEvent.type(input, "testing");

    userEvent.click(backToCaseButton);

    const cancelEditLetterDialog = screen.getAllByTestId(
      "dialog-cancel-button"
    );
    expect(cancelEditLetterDialog.length).toEqual(1);
  });

  test("open cancel dialog and not save edits when clicking nav bar buttons", () => {
    history.push("/");

    expect(screen.queryAllByTestId("dialog-cancel-button")).toHaveLength(0);

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    const input = screen.getByTestId("editLetterInput");
    userEvent.type(input, "testing");

    history.push("/");
    const cancelEditLetterDialog = screen.getAllByTestId(
      "dialog-cancel-button"
    );
    expect(cancelEditLetterDialog.length).toEqual(1);
  });

  test("open cancel dialog and not save edits when clicking logout", () => {
    history.push("/logout");

    expect(screen.queryAllByTestId("dialog-cancel-button")).toHaveLength(0);

    expect(dispatchSpy).not.toHaveBeenCalledWith(editReferralLetterContent());

    const input = screen.getByTestId("editLetterInput");
    userEvent.type(input, "testing");

    history.push("/logout");
    const cancelEditLetterDialog = screen.getAllByTestId(
      "dialog-cancel-button"
    );
    expect(cancelEditLetterDialog.length).toEqual(1);
  });

  test("does not open cancel dialog and saves edits when clicking save button", async () => {
    console.warn = () => {};
    const input = screen.getByTestId("editLetterInput");
    userEvent.clear(input);
    userEvent.type(input, "<p>Letter Preview HTML change </p>");

    const saveButton = screen.getByTestId("save-button");
    userEvent.click(saveButton);

    const expectedFormValues = {
      editedLetterHtml: "<p>Letter Preview HTML change</p>"
    };
    expect(dispatchSpy).toHaveBeenCalledWith(
      editReferralLetterContent(
        caseId,
        expectedFormValues,
        `/cases/${caseId}/letter/letter-preview`
      )
    );
  });

  test("redirects to case details page if not in a valid status", () => {
    store.dispatch(
      getCaseDetailsSuccess({ status: CASE_STATUS.FORWARDED_TO_AGENCY })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
  });

  test("does not redirect on invalid status if haven't fetched status yet", () => {
    store.dispatch(getCaseDetailsSuccess({ status: null }));
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      invalidCaseStatusRedirect(caseId)
    );
  });
});
