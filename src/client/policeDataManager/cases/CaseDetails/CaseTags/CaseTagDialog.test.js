import React from "react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import CaseTagDialog from "./CaseTagDialog";
import {
  closeCaseTagDialog,
  getCaseDetailsSuccess,
  openCaseTagDialog
} from "../../../actionCreators/casesActionCreators";
import {
  containsText,
  findCreatableDropdownOption
} from "../../../../testHelpers";
import mount from "enzyme/mount";
import { reset } from "redux-form";
import createCaseTag from "../../thunks/createCaseTag";
import { CASE_TAG_FORM_NAME } from "../../../../../sharedUtilities/constants";
import Case from "../../../../../sharedTestHelpers/case";
import getTagDropdownValues from "../../../tags/thunks/getTagDropdownValues";
import { getTagsSuccess } from "../../../actionCreators/tagActionCreators";

jest.mock("../../thunks/createCaseTag", () => (values, caseId) => ({
  type: "MOCK_CREATE_CASE_TAG",
  values,
  caseId
}));

jest.mock("../../../tags/thunks/getTagDropdownValues", () => values => ({
  type: "MOCK_GET_TAGS",
  values
}));

describe("CaseTagDialog", () => {
  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");
  let dialog;

  beforeEach(() => {
    dialog = mount(
      <Provider store={store}>
        <CaseTagDialog />
      </Provider>
    );

    store.dispatch(openCaseTagDialog());
  });

  test("should open dialog when openCaseTagDialog is dispatched", () => {
    dialog.update();

    containsText(dialog, '[data-testid="caseTagDialogTitle"]', "Add New Tag");
  });

  test("should close dialog and reset form when cancel button is clicked", () => {
    dialog.update();

    const cancelButton = dialog
      .find('[data-testid="caseTagCancelButton"]')
      .first();
    cancelButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(closeCaseTagDialog());
    expect(dispatchSpy).toHaveBeenCalledWith(reset(CASE_TAG_FORM_NAME));
  });

  test("should load tags on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getTagDropdownValues());
  });

  test("tags should appear in dropdown menu", () => {
    const testTag = { name: "testTagName", id: 1 };

    store.dispatch(getTagsSuccess([testTag]));

    dialog.update();

    findCreatableDropdownOption(
      dialog,
      '[data-testid="caseTagDropdown"]',
      "testTagName"
    );
  });

  test("should dispatch createCaseTag when clicking submit button", () => {
    const testTagName = "testTagName";
    const caseDetails = new Case.Builder().defaultCase().withId(73).build();
    store.dispatch(getCaseDetailsSuccess(caseDetails));

    dialog.update();

    const submitButton = dialog
      .find('[data-testid="caseTagSubmitButton"]')
      .first();

    const expectedSubmittedValues = {
      caseTagValue: { label: testTagName, value: testTagName }
    };

    store.dispatch({
      type: "@@redux-form/CHANGE",
      meta: {
        form: CASE_TAG_FORM_NAME,
        field: "caseTagValue",
        touch: false,
        persistentSubmitErrors: false
      },
      payload: { label: testTagName, value: testTagName }
    });

    dialog.update();

    submitButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      createCaseTag(expectedSubmittedValues, caseDetails.id)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(reset(CASE_TAG_FORM_NAME));
  });

  test("add tag button should not be clickable when no tag is entered", () => {
    const caseDetails = new Case.Builder().defaultCase().withId(73).build();

    store.dispatch(getCaseDetailsSuccess(caseDetails));

    dialog.update();

    const submitButton = dialog
      .find('[data-testid="caseTagSubmitButton"]')
      .first();
    submitButton.simulate("click");

    expect(
      dialog.find('[data-testid="caseTagDropdown"]').last().text()
    ).not.toContain("Please enter a tag name");

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      createCaseTag({ caseId: caseDetails.id, caseTag: undefined })
    );
  });
});
