import React from "react";
import { mount } from "enzyme";
import updateNarrative from "../thunks/updateNarrative";
import { changeInput, containsText } from "../../../testHelpers";
import Narrative from "./Narrative";
import createConfiguredStore from "../../../createConfiguredStore";
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
          isArchived={false}
        />
      </Provider>
    );
  });

  test("should have initial values", () => {
    containsText(
      narrative,
      '[data-testid="narrativeDetailsInput"]',
      expectedCase.narrativeDetails
    );
    containsText(
      narrative,
      '[data-testid="narrativeSummaryInput"]',
      expectedCase.narrativeSummary
    );
  });

  test("should update case narrative when focus lost on narrative details", () => {
    const updateDetails = {
      narrativeDetails: "sample narrative with additional details.",
      id: expectedCase.id
    };

    changeInput(
      narrative,
      'textarea[data-testid="narrativeDetailsInput"]',
      updateDetails.narrativeDetails
    );

    narrative.find('textarea[data-testid="narrativeDetailsInput"]').simulate("blur");

    expect(dispatchSpy).toHaveBeenCalledWith(updateNarrative(updateDetails));
    expect(updateNarrative).toHaveBeenCalledWith(updateDetails);
  });

  test("should update case narrative when focus lost on narrative summary", () => {
    const updateDetails = {
      narrativeSummary: "sample narrative with a summary",
      id: expectedCase.id
    };

    changeInput(
        narrative,
        'textarea[data-testid="narrativeSummaryInput"]',
        updateDetails.narrativeSummary
    );

    narrative.find('textarea[data-testid="narrativeSummaryInput"]').simulate("blur");

    expect(dispatchSpy).toHaveBeenCalledWith(updateNarrative(updateDetails));
    expect(updateNarrative).toHaveBeenCalledWith(updateDetails);
  });

  test("should not update case narrative summary when pristine", () => {
    updateNarrative.mockReset();

    narrative.find('textarea[data-testid="narrativeSummaryInput"]').simulate("blur");

    expect(updateNarrative).not.toHaveBeenCalledWith(expectedCase);
    expect(dispatchSpy).not.toHaveBeenCalledWith(updateNarrative(expectedCase));
  });

  test("should not update case narrative details when pristine", () => {
    updateNarrative.mockReset();

    narrative.find('textarea[data-testid="narrativeDetailsInput"]').simulate("blur");

    expect(updateNarrative).not.toHaveBeenCalledWith(expectedCase);
    expect(dispatchSpy).not.toHaveBeenCalledWith(updateNarrative(expectedCase));
  });
});
