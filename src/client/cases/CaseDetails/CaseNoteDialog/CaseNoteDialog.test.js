import React from "react";
import mount from "enzyme/mount";
import CaseNoteDialog from "./CaseNoteDialog";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  closeCaseNoteDialog,
  getCaseDetailsSuccess,
  openCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { changeInput, selectDropdownOption } from "../../../testHelpers";
import addCaseNote from "../../thunks/addCaseNote";
import { reset, initialize } from "redux-form";
import editCaseNote from "../../thunks/editCaseNote";
import moment from "moment";

jest.mock("../../thunks/addCaseNote", () => values => ({
  type: "MOCK_THUNK",
  values
}));

jest.mock("../../thunks/editCaseNote", () => values => ({
  type: "MOCK_THUNK_TWO",
  values
}));

describe("CaseNoteDialog", () => {
  test("should close dialog and reset form when cancel button is clicked", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(openCaseNoteDialog());

    const wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog />
      </Provider>
    );

    const closeButton = wrapper.find('[data-test="cancelButton"]').first();
    closeButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(reset("CaseNotes"));
  });

  test("should render and submit edit version of the dialog", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;
    store.dispatch(openCaseNoteDialog("Edit", {}));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog />
      </Provider>
    );

    const title = wrapper.find('[data-test="caseNoteDialogTitle"]').first();
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

    expect(dispatchSpy).toHaveBeenCalledWith(editCaseNote(submittedValues));
  });

  test("should not submit form when Edit Case Note is clicked and no action is selected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;

    store.dispatch(openCaseNoteDialog("Edit", {}));

    const wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog caseId={caseId} />
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

    expect(dispatchSpy).not.toHaveBeenCalledWith(editCaseNote(submittedValues));
  });

  test("should submit form with new actionTakenAt when Add Case Note is clicked", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;
    store.dispatch(openCaseNoteDialog("Add", {}));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog />
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

    expect(dispatchSpy).toHaveBeenCalledWith(addCaseNote(submittedValues));
  });

  test("should not submit form when Add Case Note is clicked and no action is selected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;

    store.dispatch(openCaseNoteDialog("Add", {}));

    const wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog caseId={caseId} />
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

    expect(dispatchSpy).not.toHaveBeenCalledWith(addCaseNote(submittedValues));
  });

  test("should not submit actionTakenAt value when it is equal to current value", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 12;
    const actionTakenAt = new Date();
    const initialValues = {
      actionTakenAt: moment(actionTakenAt).format("YYYY-MM-DDTHH:mm:ss"),
      action: "some action"
    };

    store.dispatch(initialize("CaseNotes", initialValues));
    store.dispatch(openCaseNoteDialog("Edit", initialValues));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog />
      </Provider>
    );

    changeInput(wrapper, '[data-test="notesInput"]', "some notes");

    const submitButton = wrapper.find('[data-test="submitButton"]').first();
    submitButton.simulate("click");

    const valuesToSubmit = {
      caseId: caseId,
      notes: "some notes",
      action: "some action"
    };

    expect(dispatchSpy).toHaveBeenCalledWith(editCaseNote(valuesToSubmit));
  });
});
