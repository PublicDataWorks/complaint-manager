import React from "react";
import { mount } from "enzyme";
import updateNarrative from "../thunks/updateNarrative";
import { changeInput, containsText } from "../../testHelpers";
import Narrative from "./Narrative";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";

jest.mock("../thunks/updateNarrative", () =>
  jest.fn(() => ({
    type: "MOCK_UPDATE_NARRATIVE_THUNK"
  }))
);

describe("narrative", () => {
  let narrative, expectedCase, dispatchSpy;

  beforeEach(() => {
    expectedCase = {
      id: 5,
      narrativeDetails: "MOCK NARRATIVE DETAILS",
      narrativeSummary: "MOCK NARRATIVE SUMMARY"
    };

    const store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    narrative = mount(
      <Provider store={store}>
        <Narrative
          caseId={expectedCase.id}
          initialValues={{
            narrativeDetails: expectedCase.narrativeDetails,
            narrativeSummary: expectedCase.narrativeSummary
          }}
        />
      </Provider>
    );
  });

  test("should have initial values", () => {
    containsText(
      narrative,
      '[data-test="narrativeDetailsInput"]',
      expectedCase.narrativeDetails
    );
    containsText(
      narrative,
      '[data-test="narrativeSummaryInput"]',
      expectedCase.narrativeSummary
    );
  });

  test("should update case narrative when save button is clicked", () => {
    const updateDetails = {
      narrativeDetails: "sample narrative with additional details.",
      narrativeSummary: "sample narrative with a summary",
      id: expectedCase.id
    };

    changeInput(
      narrative,
      'textarea[data-test="narrativeDetailsInput"]',
      updateDetails.narrativeDetails
    );
    changeInput(
      narrative,
      'textarea[data-test="narrativeSummaryInput"]',
      updateDetails.narrativeSummary
    );

    const saveButton = narrative.find('button[data-test="saveNarrative"]');
    saveButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(updateNarrative(updateDetails));
    expect(updateNarrative).toHaveBeenCalledWith(updateDetails);
  });

  test("should disable the submit button when pristine", () => {
    updateNarrative.mockReset();

    const saveButton = narrative.find('button[data-test="saveNarrative"]');
    saveButton.simulate("click");

    expect(updateNarrative).not.toHaveBeenCalledWith(expectedCase);
    expect(dispatchSpy).not.toHaveBeenCalledWith(updateNarrative(expectedCase));
  });
});
