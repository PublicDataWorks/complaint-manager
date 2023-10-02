import createConfiguredStore from "../../../../createConfiguredStore";
import ChangeComplaintTypeDialog from "./ChangeComplaintTypeDialog";
import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import {
  GET_COMPLAINT_TYPES_SUCCEEDED,
  RANK_INITIATED,
  CIVILIAN_INITIATED,
  CHANGE_COMPLAINT_TYPE_FORM_NAME
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

describe("ChangeComplaintTypeDialog", () => {
  const store = createConfiguredStore();

  store.dispatch({
    type: GET_COMPLAINT_TYPES_SUCCEEDED,
    payload: [{ name: RANK_INITIATED }, { name: CIVILIAN_INITIATED }]
  });
  let dispatchSpy;
  let dialog;
  const setDialog = jest.fn();
  const caseId = 1;
  const caseDetails = new Case.Builder()
    .defaultCase()
    .withId(caseId)
    .withComplaintTypeId(1)
    .build();

  beforeEach(() => {
    dispatchSpy = jest.spyOn(store, "dispatch");
    dialog = render(
      <Provider store={store}>
        <ChangeComplaintTypeDialog
          open={true}
          setDialog={openState => setDialog(openState)}
          caseDetails={caseDetails}
        />
        <SharedSnackbarContainer />
      </Provider>
    );
  });

  test("should open dialog when openChangeComplaintTypeDialog is dispatched", () => {
    expect(
      screen.getByTestId("ChangeComplaintTypeDialogTitle").textContent
    ).toEqual("Complaint Type");
  });

  test("should close dialog and reset form when cancel button is clicked", () => {
    userEvent.click(screen.getByText("Cancel"));
    expect(setDialog).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      reset(CHANGE_COMPLAINT_TYPE_FORM_NAME)
    );
  });

  test("complaint types should appear in dropdown menu", async () => {
    userEvent.click(screen.getByTestId("complaintDropdownInput"));
    expect(await screen.findByText(CIVILIAN_INITIATED)).toBeInTheDocument();
  });

  test("should dispatch updateCase when clicking submit button", async () => {
    let caseDetailsCopy = { ...caseDetails };
    caseDetailsCopy.complaintType = CIVILIAN_INITIATED;
    store.dispatch(getCaseDetailsSuccess(caseDetails));
    nock("http://localhost", {})
      .put(`/api/cases/${caseId}`, caseDetailsCopy)
      .reply(200, {});
    userEvent.click(screen.getByTestId("complaintDropdownInput"));
    const newComplaintType = await screen.findByText(CIVILIAN_INITIATED);
    userEvent.click(newComplaintType);
    userEvent.click(screen.getByTestId("changeComplaintTypeSubmitButton"));
    expect(dispatchSpy).toHaveBeenCalledWith(
      reset(CHANGE_COMPLAINT_TYPE_FORM_NAME)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(updateCase(caseDetailsCopy));
  });

  test("change complaint type button should be clickable when original no complaint type is selected", () => {
    expect(screen.getByTestId("complaintDropdownInput").value).toEqual("");
    expect(
      screen.getByTestId("changeComplaintTypeSubmitButton").disabled
    ).toBeFalse();
  });
});
