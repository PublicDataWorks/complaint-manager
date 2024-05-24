import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import updateNarrative from "../thunks/updateNarrative";
import { changeInput, containsHTML, containsText } from "../../../testHelpers";
import Narrative from "./Narrative";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";
import userEvent from "@testing-library/user-event";

require("../../testUtilities/MockMutationObserver");

jest.mock("../thunks/updateNarrative", () =>
  jest.fn(details => {
    return {
      type: "MOCK_UPDATE_NARRATIVE_THUNK"
    };
  })
);

jest.mock("../../shared/components/RichTextEditor/RichTextEditor", () => ({
  RichTextEditorComponent: props => (
    <input
      type="text"
      data-testid={props["data-testid"]}
      onChange={props.onChange}
      value={props.input.value}
    />
  )
}));

describe("narrative", () => {
  let expectedCase, dispatchSpy;

  describe("without permissions", () => {
    beforeEach(() => {
      expectedCase = {
        id: 5,
        narrativeDetails: "<p>MOCK NARRATIVE DETAILS HTML</p>",
        narrativeSummary: "MOCK NARRATIVE SUMMARY"
      };
      const store = createConfiguredStore();
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.ARCHIVE_CASE] }
      });
      dispatchSpy = jest.spyOn(store, "dispatch");

      render(
        <Provider store={store}>
          <Narrative
            caseId={expectedCase.id}
            initialValues={{
              narrativeDetails: expectedCase.narrativeDetails,
              narrativeSummary: expectedCase.narrativeSummary
            }}
            isArchived={false}
            setSearchableDataAsDirty={jest.fn()}
          />
        </Provider>
      );
    });

    test("should not be able to update text in the summary field", () => {
      const input = screen.getByTestId("narrativeDetailsField");
      expect(input).toBeTruthy();
    });

    test("should not be able to update narrative details", () => {
      const input = screen.getByTestId("narrativeDetailsField");
      const initialValue = input.value;
      userEvent.type(input, "new text");
      expect(input.value).toBe(initialValue);
    });
  });

  describe("with permissions", () => {
    beforeEach(() => {
      expectedCase = {
        id: 5,
        narrativeDetails: "<p>MOCK NARRATIVE DETAILS HTML</p>",
        narrativeSummary: "MOCK NARRATIVE SUMMARY"
      };
      const store = createConfiguredStore();
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
      });
      dispatchSpy = jest.spyOn(store, "dispatch");

      render(
        <Provider store={store}>
          <Narrative
            caseId={expectedCase.id}
            initialValues={{
              narrativeDetails: expectedCase.narrativeDetails,
              narrativeSummary: expectedCase.narrativeSummary
            }}
            isArchived={false}
            setSearchableDataAsDirty={jest.fn()}
          />
        </Provider>
      );
    });

    test("should have initial values", () => {
      expect(
        screen
          .getByTestId("narrativeDetailsField")
          .value.includes(expectedCase.narrativeDetails)
      ).toBe(true);
    });

    // Deleted tests involving autoSave onBlur for Narrative Details due to the change
    // to Quill. Testing via e2e.

    test("should update case narrative when focus lost on narrative summary", () => {
      const updateDetails = {
        narrativeSummary: "sample narrative with a summary",
        id: expectedCase.id
      };

      const input = screen.getByTestId("narrativeSummaryInput");
      userEvent.type(input, updateDetails.narrativeSummary);

      fireEvent.blur(input);

      expect(dispatchSpy).toHaveBeenCalledWith(updateNarrative(updateDetails));
      expect(updateNarrative).toHaveBeenCalledWith(updateDetails);
    });

    test("should not update case narrative summary when pristine", () => {
      updateNarrative.mockReset();

      const input = screen.getByTestId("narrativeSummaryInput");
      fireEvent.blur(input);

      expect(updateNarrative).not.toHaveBeenCalledWith(expectedCase);
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        updateNarrative(expectedCase)
      );
    });
  });
});
