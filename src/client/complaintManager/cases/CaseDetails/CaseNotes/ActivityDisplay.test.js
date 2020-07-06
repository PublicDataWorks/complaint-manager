import ActivityDisplay from "./ActivityDisplay";
import React from "react";
import { mount } from "enzyme";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import CardContent from "@material-ui/core/CardContent";

describe("ActivityDisplay", () => {
  let actionTakenAtDateTime, caseNote;
  beforeEach(() => {
    actionTakenAtDateTime = new Date(
      "December 17, 1995 03:24:00"
    ).toISOString();
    console.log(actionTakenAtDateTime);

    caseNote = {
      id: 1,
      caseId: 2,
      author: { name: "tuser", email: "some@some.com" },
      caseNoteAction: { name: "Miscellaneous", id: 1 },
      notes: "notes",
      actionTakenAt: actionTakenAtDateTime
    };
  });

  test("should be able to display case note without highlight", () => {
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
    containsText(
      wrapper,
      '[data-testid="userAndActionText"]',
      caseNote.author.name
    );
    containsText(
      wrapper,
      '[data-testid="activityTimeText"]',
      "Dec 17, 1995 3:24 AM"
    );
    containsText(wrapper, '[data-testid="notesText"]', caseNote.notes);
  });

  test("should be able to display case note with highlight", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <ActivityDisplay
          activity={caseNote}
          highlightedCaseNote={{ caseNoteId: caseNote.id }}
        />
      </Provider>
    );

    expect(
      wrapper.contains(
        <CardContent
          style={{
            minWidth: 10,
            backgroundColor: "#D32F2F",
            padding: 0
          }}
        />
      )
    ).toEqual(true);
  });
});
