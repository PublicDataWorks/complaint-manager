import React from "react";

import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import AllegationDetailsForm from "./AllegationDetailsForm";
import { changeInput, selectDropdownOption } from "../testHelpers";
import { ALLEGATION_SEVERITY } from "../../sharedUtilities/constants";

jest.mock(
  "../cases/thunks/createOfficerAllegation",
  () => (formValues, caseId, caseOfficerId, callbackFunction) => ({
    type: "something",
    formValues,
    caseId,
    caseOfficerId,
    callbackFunction
  })
);

describe("AllegationDetailsForm", () => {
  let allegationId,
    caseId,
    caseOfficerId,
    allegationDetailsForm,
    dispatch,
    successCallbackFunction;

  beforeEach(() => {
    const store = createConfiguredStore();
    dispatch = jest.spyOn(store, "dispatch");
    allegationId = 1;
    caseId = "15";
    caseOfficerId = "4";
    successCallbackFunction = jest.fn();

    allegationDetailsForm = mount(
      <Provider store={store}>
        <AllegationDetailsForm
          allegationId={allegationId}
          form={`AllegationForm_${allegationId}`}
          caseId={caseId}
          caseOfficerId={caseOfficerId}
          addAllegationSuccess={successCallbackFunction}
        />
      </Provider>
    );
  });

  test("it calls createOfficerAllegation with appropriate values on submit", () => {
    changeInput(
      allegationDetailsForm,
      '[data-test="allegationDetailsInput"]',
      "some details"
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-test="allegationSeverityField"]',
      ALLEGATION_SEVERITY.MEDIUM
    );

    const addButton = allegationDetailsForm
      .find('[data-test="addAllegationButton"]')
      .last();
    addButton.simulate("click");

    const formValues = {
      allegationId,
      details: "some details",
      severity: ALLEGATION_SEVERITY.MEDIUM
    };

    expect(dispatch).toHaveBeenCalledWith(
      createOfficerAllegation(
        formValues,
        caseId,
        caseOfficerId,
        successCallbackFunction
      )
    );
  });

  test("submit button is disabled when no allegation details have been entered", () => {
    const addButton = allegationDetailsForm
      .find('[data-test="addAllegationButton"]')
      .last();

    selectDropdownOption(
      allegationDetailsForm,
      '[data-test="allegationSeverityField"]',
      ALLEGATION_SEVERITY.MEDIUM
    );

    expect(addButton.props().disabled).toBeTruthy();
  });

  test("submit button is disabled when no allegation severity has been selected", () => {
    const addButton = allegationDetailsForm
      .find('[data-test="addAllegationButton"]')
      .last();

    changeInput(
      allegationDetailsForm,
      '[data-test="allegationDetailsInput"]',
      "some details"
    );

    expect(addButton.props().disabled).toBeTruthy();
  });

  test("submit button is disabled when empty string has been entered as allegation details", () => {
    changeInput(
      allegationDetailsForm,
      '[data-test="allegationDetailsInput"]',
      "   "
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-test="allegationSeverityField"]',
      ALLEGATION_SEVERITY.MEDIUM
    );

    const addButton = allegationDetailsForm
      .find('[data-test="addAllegationButton"]')
      .last();

    expect(addButton.props().disabled).toBeTruthy();
  });

  test("submit button is enabled when allegation details and severity are present", () => {
    changeInput(
      allegationDetailsForm,
      '[data-test="allegationDetailsInput"]',
      "details"
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-test="allegationSeverityField"]',
      ALLEGATION_SEVERITY.MEDIUM
    );
    allegationDetailsForm.update();

    const addButton = allegationDetailsForm
      .find('[data-test="addAllegationButton"]')
      .last();

    expect(addButton.props().disabled).toBeFalsy();
  });
});
