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
import getUsers from "../../../../../server/handlers/users/getUsers";
import userEvent from "@testing-library/user-event";
import { reset } from "redux-form";

// jest.mock("../../thunks/createCaseTag", () => (values, caseId) => ({
//     type: "MOCK_CREATE_CASE_TAG",
//     values,
//     caseId
//   }));

jest.mock("../../thunks/editCase", () => caseId => ({
  type: "MOCK_EDIT_CASE",
  caseId
}));

describe("ReassignCaseDialog", () => {
  const store = createConfiguredStore();
  store.dispatch({ type: GET_USERS_SUCCESS, users: FAKE_USERS });
  const dispatchSpy = jest.spyOn(store, "dispatch");
  let dialog;
  const closeFunction = jest.fn();

  beforeEach(() => {
    dialog = render(
      <Provider store={store}>
        <ReassignCaseDialog
          open={true}
          close={closeFunction}
          caseDetails={{ assignedTo: FAKE_USERS[0].email }}
        />
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
    expect(closeFunction).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(reset(REASSIGN_CASE_FORM_NAME));
  });

  test("users should appear in dropdown menu", async () => {
    userEvent.click(screen.getByTestId("userDropdownInput"));
    expect(await screen.findByText(FAKE_USERS[1].email)).toBeInTheDocument;
  });

  test("should dispatch editCase when clicking submit button", async () => {
    userEvent.click(screen.getByTestId("userDropdownInput"));
    const newAssignee = await screen.findByText(FAKE_USERS[1].email);
    userEvent.click(newAssignee);
    userEvent.click(screen.getByTestId("assignedToSubmitButton"));
    expect();
  });

  test("assign user button should not be clickable when original user is selected", () => {
    expect(screen.getByTestId("userDropdownInput").value).toEqual(
      FAKE_USERS[0].email
    );
    expect(screen.getByTestId("assignedToSubmitButton").disabled).toBeTrue();
  });
});
