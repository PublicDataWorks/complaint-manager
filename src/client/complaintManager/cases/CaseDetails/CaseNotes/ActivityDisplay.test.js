import ActivityDisplay from "./ActivityDisplay";
import React from "react";
import { mount } from "enzyme";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";

describe("ActivityDisplay", () => {
  test("should be able to display case note", () => {
    const actionTakenAtDateTime = new Date(
      "December 17, 1995 03:24:00"
    ).toISOString();
    console.log(actionTakenAtDateTime);
    const caseNote = {
      id: 1,
      caseId: 2,
      user: "tuser",
      caseNoteAction: { name: "Miscellaneous", id: 1 },
      notes: "notes",
      actionTakenAt: actionTakenAtDateTime
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
      "Dec 17, 1995 3:24 AM"
    );
    containsText(wrapper, '[data-testid="notesText"]', caseNote.notes);
  });
});
