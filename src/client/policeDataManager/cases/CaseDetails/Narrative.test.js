import React from "react";
import { mount } from "enzyme";
import updateNarrative from "../thunks/updateNarrative";
import { changeInput, containsHTML, containsText } from "../../../testHelpers";
import Narrative from "./Narrative";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";

require("../../testUtilities/MockMutationObserver");

jest.mock("../thunks/updateNarrative", () =>
  jest.fn(details => {
    return {
      type: "MOCK_UPDATE_NARRATIVE_THUNK"
    };
  })
);

describe("narrative", () => {
  let narrative, expectedCase, dispatchSpy;

  beforeEach(() => {
    expectedCase = {
      id: 5,
      narrativeDetails: "<p>MOCK NARRATIVE DETAILS HTML</p>",
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
    containsHTML(narrative, "Quill", expectedCase.narrativeDetails);

    containsText(
      narrative,
      '[data-testid="narrativeSummaryInput"]',
      expectedCase.narrativeSummary
    );
  });

  // Deleted tests involving autoSave onBlur for Narrative Details due to the change
  // to Quill. Testing via e2e.

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

    narrative
      .find('textarea[data-testid="narrativeSummaryInput"]')
      .simulate("blur");

    expect(dispatchSpy).toHaveBeenCalledWith(updateNarrative(updateDetails));
    expect(updateNarrative).toHaveBeenCalledWith(updateDetails);
  });

  test("should not update case narrative summary when pristine", () => {
    updateNarrative.mockReset();

    narrative
      .find('textarea[data-testid="narrativeSummaryInput"]')
      .simulate("blur");

    expect(updateNarrative).not.toHaveBeenCalledWith(expectedCase);
    expect(dispatchSpy).not.toHaveBeenCalledWith(updateNarrative(expectedCase));
  });
});
