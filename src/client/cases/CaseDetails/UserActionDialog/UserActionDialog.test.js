import React from "react";
import mount from "enzyme/mount";
import UserActionDialog from "./UserActionDialog";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  closeUserActionDialog,
  getCaseDetailsSuccess,
  openUserActionDialog
} from "../../../actionCreators/casesActionCreators";
import { changeInput, selectDropdownOption } from "../../../../testHelpers";
import addUserAction from "../../thunks/addUserAction";
import timezone from "moment-timezone";
import { TIMEZONE } from "../../../../sharedUtilities/constants";
import { reset } from "redux-form";
import editUserAction from "../../thunks/editUserAction";

jest.mock("../../thunks/addUserAction", () => values => ({
  type: "MOCK_THUNK",
  values
}));

jest.mock("../../thunks/editUserAction", () => values => ({
  type: "MOCK_THUNK_TWO",
  values
}));

describe("UserActionDialog", () => {
  test("should close dialog and reset form when cancel button is clicked", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openUserActionDialog());

    const wrapper = mount(
      <Provider store={store}>
        <UserActionDialog />
      </Provider>
    );

    const closeButton = wrapper.find('[data-test="cancelButton"]').first();
    closeButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(closeUserActionDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(reset("UserActions"));
  });

  test("should render and submit edit version of the dialog", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;
    store.dispatch(openUserActionDialog("Edit"));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <UserActionDialog />
      </Provider>
    );

    const title = wrapper.find('[data-test="userActionDialogTitle"]').first();
    const submitButton = wrapper.find('[data-test="submitButton"]').first();

    expect(title.text()).toEqual("Edit Case Note");
    expect(submitButton.text()).toEqual("Save");

    const dateWithOutTimeZone = "2018-05-16T18:47";

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00",
      action: "Miscellaneous"
    };

    changeInput(wrapper, '[data-test="dateAndTimeInput"]', dateWithOutTimeZone);

    selectDropdownOption(
      wrapper,
      '[data-test="actionsDropdown"]',
      submittedValues.action
    );
    submitButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(editUserAction(submittedValues));
  });

  test("should not submit form when Edit Case Note is clicked and no action is selected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;

    store.dispatch(openUserActionDialog("Edit"));

    const wrapper = mount(
      <Provider store={store}>
        <UserActionDialog caseId={caseId} />
      </Provider>
    );
    const dateWithOutTimeZone = "2018-05-16T18:47";

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00"
    };

    changeInput(wrapper, '[data-test="dateAndTimeInput"]', dateWithOutTimeZone);

    const submitButton = wrapper.find('[data-test="submitButton"]').first();
    submitButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      editUserAction(submittedValues)
    );
  });

  test("should submit form when Add Case Note is clicked", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;
    store.dispatch(openUserActionDialog("Add"));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <UserActionDialog />
      </Provider>
    );

    const dateWithOutTimeZone = "2018-05-16T18:47";

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00",
      action: "Miscellaneous",
      notes: "these are notes"
    };

    changeInput(wrapper, '[data-test="dateAndTimeInput"]', dateWithOutTimeZone);
    selectDropdownOption(
      wrapper,
      '[data-test="actionsDropdown"]',
      submittedValues.action
    );
    changeInput(wrapper, '[data-test="notesInput"]', submittedValues.notes);

    const submitButton = wrapper.find('[data-test="submitButton"]').first();
    submitButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(addUserAction(submittedValues));
  });

  test("should not submit form when Add Case Note is clicked and no action is selected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;

    store.dispatch(openUserActionDialog("Add"));

    const wrapper = mount(
      <Provider store={store}>
        <UserActionDialog caseId={caseId} />
      </Provider>
    );

    const dateWithOutTimeZone = "2018-05-16T18:47";

    changeInput(wrapper, '[data-test="dateAndTimeInput"]', dateWithOutTimeZone);

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00"
    };

    const submitButton = wrapper.find('[data-test="submitButton"]').first();
    submitButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      addUserAction(submittedValues)
    );
  });
});
