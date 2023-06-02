import React from "react";

import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import AllegationDetailsForm from "./AllegationDetailsForm";
import { changeInput, selectDropdownOption } from "../../testHelpers";
import {
  ALLEGATION_SEVERITY,
  GET_RULE_CHAPTERS_SUCCESS
} from "../../../sharedUtilities/constants";

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
    successCallbackFunction,
    onSubmit;

  beforeEach(() => {
    const store = createConfiguredStore();
    dispatch = jest.spyOn(store, "dispatch");
    allegationId = 1;
    caseId = "15";
    caseOfficerId = "4";
    successCallbackFunction = jest.fn();
    onSubmit = jest.fn();

    store.dispatch({
      type: GET_RULE_CHAPTERS_SUCCESS,
      payload: [
        { id: 1, name: "Chapter 1: Unexpected party" },
        { id: 2, name: "Chapter 2: Roast mutton" },
        { id: 3, name: "Chapter 3: Short rest" },
        { id: 4, name: "Chapter 4: Over hill and under hill" },
        { id: 5, name: "Chapter 5: Riddles in the dark" },
        { id: 6, name: "Chapter 6: Out of the frying-pan into the fire" }
      ]
    });

    allegationDetailsForm = mount(
      <Provider store={store}>
        <AllegationDetailsForm
          allegationId={allegationId}
          form={`AllegationForm_${allegationId}`}
          caseId={caseId}
          caseOfficerId={caseOfficerId}
          addAllegationSuccess={successCallbackFunction}
          onSubmit={onSubmit}
        />
      </Provider>
    );
  });

  test("submit button is disabled when no allegation details have been entered", () => {
    const addButton = allegationDetailsForm
      .find('[data-testid="allegation-submit-btn"]')
      .last();

    selectDropdownOption(
      allegationDetailsForm,
      '[data-testid="allegation-severity-field"]',
      ALLEGATION_SEVERITY.MEDIUM
    );

    expect(addButton.props().disabled).toBeTruthy();
  });

  test("submit button is disabled when no allegation severity has been selected", () => {
    const addButton = allegationDetailsForm
      .find('[data-testid="allegation-submit-btn"]')
      .last();

    changeInput(
      allegationDetailsForm,
      '[data-testid="allegation-details-input"]',
      "some details"
    );

    expect(addButton.props().disabled).toBeTruthy();
  });

  test("submit button is disabled when empty string has been entered as allegation details", () => {
    changeInput(
      allegationDetailsForm,
      '[data-testid="allegation-details-input"]',
      "   "
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-testid="allegation-severity-field"]',
      ALLEGATION_SEVERITY.MEDIUM
    );

    const addButton = allegationDetailsForm
      .find('[data-testid="allegation-submit-btn"]')
      .last();

    expect(addButton.props().disabled).toBeTruthy();
  });

  test("submit button is enabled when allegation details and severity are present", () => {
    changeInput(
      allegationDetailsForm,
      '[data-testid="allegation-details-input"]',
      "details"
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-testid="allegation-severity-field"]',
      ALLEGATION_SEVERITY.MEDIUM
    );
    allegationDetailsForm.update();

    const addButton = allegationDetailsForm
      .find('[data-testid="allegation-submit-btn"]')
      .last();

    expect(addButton.props().disabled).toBeFalsy();
  });

  test("should submit with all the stuff when when all the stuff is filled out", () => {
    changeInput(
      allegationDetailsForm,
      '[data-testid="allegation-details-input"]',
      "details"
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-testid="allegation-severity-field"]',
      ALLEGATION_SEVERITY.MEDIUM
    );

    selectDropdownOption(
      allegationDetailsForm,
      '[data-testid="rule-chapter-field"]',
      "Chapter 4: Over hill and under hill"
    );
    allegationDetailsForm.update();

    const addButton = allegationDetailsForm
      .find('[data-testid="allegation-submit-btn"]')
      .last();

    addButton.simulate("click");
    expect(onSubmit).toHaveBeenCalledWith(
      {
        ruleChapterId: 4,
        severity: ALLEGATION_SEVERITY.MEDIUM,
        details: "details"
      },
      dispatch,
      expect.anything()
    );
  });
});
