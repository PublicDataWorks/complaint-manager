import createConfiguredStore from "../../../../createConfiguredStore";
import ReassignCaseDialog from "./ReassignCaseDialog";
import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import {
  GET_USERS_SUCCESS,
  FAKE_USERS,
  REASSIGN_CASE_FORM_NAME
} from "../../../../../sharedUtilities/constants";
import userEvent from "@testing-library/user-event";
import { reset } from "redux-form";
import updateCase from "../../thunks/updateCase";
import SharedSnackbarContainer from "../../../shared/components/SharedSnackbarContainer";
import nock from "nock";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import Case from "../../../../../sharedTestHelpers/case";
import "@testing-library/jest-dom";

jest.mock("../../thunks/updateCase", () => values => ({
  type: "MOCK_UPDATE_CASE",
  values
}));

describe("ReassignCaseDialog", () => {
  const store = createConfiguredStore();

  store.dispatch({ type: GET_USERS_SUCCESS, users: FAKE_USERS });
  let dispatchSpy;
  let dialog;
  const setDialog = jest.fn();
  const caseId = 1;
  const caseDetails = new Case.Builder()
    .defaultCase()
    .withId(caseId)
    .withAssignedTo(FAKE_USERS[0].email)
    .build();

  beforeEach(() => {
    dispatchSpy = jest.spyOn(store, "dispatch");
    dialog = render(
      <Provider store={store}>
        <ReassignCaseDialog
          open={true}
          setDialog={openState => setDialog(openState)}
          caseDetails={caseDetails}
        />
        <SharedSnackbarContainer />
      </Provider>
    );

    //store.dispatch(openReassignCaseDialog());
  });

  test("should open dialog when openReassignCaseDialog is dispatched", () => {
    expect(screen.getByTestId("ReassignCaseDialogTitle").textContent).toEqual(
      "Assign User"
    );
  });

  test("should close dialog and reset form when cancel button is clicked", () => {
    userEvent.click(screen.getByText("Cancel"));
    expect(setDialog).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(reset(REASSIGN_CASE_FORM_NAME));
  });

  test("users should appear in dropdown menu", async () => {
    userEvent.click(screen.getByTestId("userDropdownInput"));
    expect(await screen.findByText(FAKE_USERS[1].name)).toBeInTheDocument();
  });

  test("should dispatch updateCase when clicking submit button", async () => {
    let caseDetailsCopy = { ...caseDetails };
    caseDetailsCopy.assignedTo = FAKE_USERS[1].email;
    store.dispatch(getCaseDetailsSuccess(caseDetails));
    nock("http://localhost", {})
      .put(`/api/cases/${caseId}`, caseDetailsCopy)
      .reply(200, {});
    userEvent.click(screen.getByTestId("userDropdownInput"));
    const newAssignee = await screen.findByText(FAKE_USERS[1].name);
    userEvent.click(newAssignee);
    userEvent.click(screen.getByTestId("assignedToSubmitButton"));
    expect(dispatchSpy).toHaveBeenCalledWith(reset(REASSIGN_CASE_FORM_NAME));
    expect(dispatchSpy).toHaveBeenCalledWith(updateCase(caseDetailsCopy));
  });

  test("assign user button should not be clickable when original user is selected", () => {
    expect(screen.getByTestId("userDropdownInput").value).toEqual(
      FAKE_USERS[0].name
    );
    expect(screen.getByTestId("assignedToSubmitButton").disabled).toBeTrue();
  });
});
