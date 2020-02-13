import React from "react";
import mount from "enzyme/mount";
import CaseNoteDialog from "./CaseNoteDialog";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  closeCaseNoteDialog,
  getCaseDetailsSuccess,
  openCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { changeInput, selectDropdownOption } from "../../../../testHelpers";
import addCaseNote from "../../thunks/addCaseNote";
import { initialize, reset } from "redux-form";
import editCaseNote from "../../thunks/editCaseNote";
import moment from "moment";
import { getCaseNoteActionsSuccess } from "../../../actionCreators/caseNoteActionActionCreators";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

jest.mock("../../thunks/addCaseNote", () => values => ({
  type: "MOCK_THUNK",
  values
}));

jest.mock("../../thunks/editCaseNote", () => values => ({
  type: "MOCK_THUNK_TWO",
  values
}));
jest.mock(
  "../../../caseNoteActions/thunks/getCaseNoteActionDropdownValues",
  () =>
    jest.fn(() => {
      return {
        type: "MOCK_GET_GENDER_IDENTITIES_THUNK"
      };
    })
);

describe("CaseNoteDialog", () => {
  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");
  let wrapper;
  const caseId = 12;
  const caseNoteActions = {
    memoToFile: ["Memo to file", 1],
    contactedOutsideAgency: ["Contacted outside agency", 2]
  };

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <CaseNoteDialog />
      </Provider>
    );
    store.dispatch(
      getCaseNoteActionsSuccess([
        caseNoteActions.memoToFile,
        caseNoteActions.contactedOutsideAgency
      ])
    );
  });

  test("should close dialog and reset form when cancel button is clicked", () => {
    store.dispatch(openCaseNoteDialog());

    wrapper.update();

    const closeButton = wrapper.find('[data-testid="cancelButton"]').first();
    closeButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseNoteDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(reset("CaseNotes"));
  });

  test("should render and submit edit version of the dialog", () => {
    store.dispatch(openCaseNoteDialog("Edit", {}));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    wrapper.update();

    const title = wrapper.find('[data-testid="caseNoteDialogTitle"]').first();
    const submitButton = wrapper.find('[data-testid="submitButton"]').first();

    expect(title.text()).toEqual("Edit Case Note");
    expect(submitButton.text()).toEqual("Save");

    const dateWithOutTimeZone = "2018-05-16T18:47";

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00",
      caseNoteActionId: caseNoteActions.memoToFile[1]
    };

    changeInput(
      wrapper,
      '[data-testid="dateAndTimeInput"]',
      dateWithOutTimeZone
    );

    selectDropdownOption(
      wrapper,
      '[data-testid="actionsDropdown"]',
      caseNoteActions.memoToFile[0]
    );
    submitButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(editCaseNote(submittedValues));
  });

  test("should not submit form when Edit Case Note is clicked and no action is selected", () => {
    store.dispatch(openCaseNoteDialog("Edit", {}));

    wrapper.update();

    const dateWithOutTimeZone = "2018-05-16T18:47";

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00"
    };

    changeInput(
      wrapper,
      '[data-testid="dateAndTimeInput"]',
      dateWithOutTimeZone
    );

    const submitButton = wrapper.find('[data-testid="submitButton"]').first();
    submitButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(editCaseNote(submittedValues));
  });

  test("should submit form with new actionTakenAt when Add Case Note is clicked", () => {
    store.dispatch(openCaseNoteDialog("Add", {}));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    wrapper.update();

    const dateWithOutTimeZone = "2018-05-16T18:47";

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00",
      caseNoteActionId: caseNoteActions.memoToFile[1],
      notes: "these are notes"
    };

    changeInput(
      wrapper,
      '[data-testid="dateAndTimeInput"]',
      dateWithOutTimeZone
    );
    selectDropdownOption(
      wrapper,
      '[data-testid="actionsDropdown"]',
      caseNoteActions.memoToFile[0]
    );
    changeInput(wrapper, '[data-testid="notesInput"]', submittedValues.notes);

    const submitButton = wrapper.find('[data-testid="submitButton"]').first();
    submitButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(addCaseNote(submittedValues));
  });

  test("should not submit form when Add Case Note is clicked and no action is selected", () => {
    store.dispatch(openCaseNoteDialog("Add", {}));

    wrapper.update();

    const dateWithOutTimeZone = "2018-05-16T18:47";

    changeInput(
      wrapper,
      '[data-testid="dateAndTimeInput"]',
      dateWithOutTimeZone
    );

    const submittedValues = {
      caseId: caseId,
      actionTakenAt: "2018-05-16T18:47:00-05:00"
    };

    const submitButton = wrapper.find('[data-testid="submitButton"]').first();
    submitButton.simulate("click");

    expect(dispatchSpy).not.toHaveBeenCalledWith(addCaseNote(submittedValues));
  });

  test("should not submit actionTakenAt value when it is equal to current value", () => {
    const caseNotes = "some notes";
    const actionTakenAt = new Date();
    const initialValues = {
      actionTakenAt: moment(actionTakenAt).format("YYYY-MM-DDTHH:mm:ss"),
      caseNoteActionId: caseNoteActions.memoToFile[1]
    };

    store.dispatch(initialize("CaseNotes", initialValues));
    store.dispatch(openCaseNoteDialog("Edit", initialValues));
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );

    wrapper.update();

    changeInput(wrapper, '[data-testid="notesInput"]', caseNotes);

    const submitButton = wrapper.find('[data-testid="submitButton"]').first();
    submitButton.simulate("click");

    const valuesToSubmit = {
      caseId: caseId,
      notes: caseNotes,
      caseNoteActionId: caseNoteActions.memoToFile[1]
    };

    expect(dispatchSpy).toHaveBeenCalledWith(editCaseNote(valuesToSubmit));
  });

  describe("Notification Feature Toggle", () => {
    const actionTakenAt = new Date();
    const initialValues = {
      actionTakenAt: moment(actionTakenAt).format("YYYY-MM-DDTHH:mm:ss"),
      caseNoteActionId: caseNoteActions.memoToFile[1]
    };

    beforeEach(() => {
      store.dispatch(initialize("CaseNotes", initialValues));
      store.dispatch(openCaseNoteDialog("Edit", initialValues));
      store.dispatch(
        getCaseDetailsSuccess({
          id: caseId
        })
      );

      wrapper.update();
    });

    test("should not show user mention dropdown when notificationFeatureFlag is disabled", () => {
      store.dispatch(
        getFeaturesSuccess({
          notificationFeature: false
        })
      );
      wrapper.update();

      const notesInput = wrapper.find('[data-testid="notes"]');

      expect(
        notesInput.find("ForwardRef(Autocomplete)").exists()
      ).not.toBeTrue();
    });

    test("should show user mention dropdown when notificationFeatureFlag is enabled", () => {
      store.dispatch(
        getFeaturesSuccess({
          notificationFeature: true
        })
      );

      wrapper.update();

      const notesInput = wrapper.find('[data-testid="notes"]');

      expect(notesInput.find("ForwardRef(Autocomplete)").exists()).toBeTrue();
    });
  });
});
