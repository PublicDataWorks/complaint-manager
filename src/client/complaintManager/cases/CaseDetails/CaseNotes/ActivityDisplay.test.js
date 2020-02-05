import ActivityDisplay from "./ActivityDisplay";
import React from "react";
import { mount } from "enzyme";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";

describe("ActivityDisplay", () => {
  test("should be able to display case note", () => {
    const caseNote = {
      id: 1,
      caseId: 2,
      user: "tuser",
      caseNoteAction: { name: "Miscellaneous", id: 1 },
      notes: "notes",
      actionTakenAt: new Date().toISOString()
    };

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <ActivityDisplay activity={caseNote} />
      </Provider>
    );

    containsText(
      wrapper,
      '[data-testid="userAndActionText"]',
      caseNote.caseNoteAction.name
    );
    containsText(wrapper, '[data-testid="userAndActionText"]', caseNote.user);
    containsText(
      wrapper,
      '[data-testid="activityTimeText"]',
      "a few seconds ago"
    );
    containsText(wrapper, '[data-testid="notesText"]', caseNote.notes);
  });
});
