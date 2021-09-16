import ActivityDisplay from "./ActivityDisplay";
import React from "react";
import { mount } from "enzyme";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import CardContent from "@material-ui/core/CardContent";

describe("ActivityDisplay", () => {
  let actionTakenAtDateTime, caseNote, caseNoteWithMentions, allUsers;
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

    caseNoteWithMentions = {
      id: 2,
      caseId: 2,
      author: { name: "tuser", email: "some@some.com" },
      caseNoteAction: { name: "Miscellaneous", id: 1 },
      notes:
        "@Veronica Blackwell notes, hey @Sabrina Sanchez (DPM) more notes @sabrina sanchez, but while we're @it",
      actionTakenAt: actionTakenAtDateTime
    };

    allUsers = [
      { label: "Sabrina Sanchez", value: "" },
      { label: "Veronica Blackwell", value: "" },
      { label: "Sabrina Sanchez (DPM)", value: "" }
    ];
  });

  test("should be able to display case note without highlight", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <ActivityDisplay activity={caseNote} allUsers={allUsers} />
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
          allUsers={allUsers}
        />
      </Provider>
    );

    expect(
      wrapper.contains(
        <CardContent
          style={{
            minWidth: 10,
            backgroundColor: "#D32F2F",
            width: "100%",
            padding: 0
          }}
        />
      )
    ).toEqual(true);
  });

  test("should be able to display case note with highlight and bolded user mentions", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <ActivityDisplay
          activity={caseNoteWithMentions}
          highlightedCaseNote={{ caseNoteId: caseNoteWithMentions.id }}
          allUsers={allUsers}
        />
      </Provider>
    );

    expect(wrapper.contains(<b>@Sabrina Sanchez (DPM)</b>)).toEqual(true);
    expect(wrapper.contains(<b>@sabrina sanchez</b>)).toEqual(true);
    expect(wrapper.contains(<b>@Veronica Blackwell</b>)).toEqual(true);
    expect(wrapper.contains(<span> notes, hey </span>)).toEqual(true);
    expect(wrapper.contains(<span> more notes </span>)).toEqual(true);
    expect(wrapper.contains(<span>, but while we're @it</span>)).toEqual(true);
    expect(
      wrapper.contains(
        <CardContent
          style={{
            minWidth: 10,
            backgroundColor: "#D32F2F",
            width: "100%",
            padding: 0
          }}
        />
      )
    ).toEqual(true);
  });

  test("should be able to display case note without highlight but with bolded user mentions", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <ActivityDisplay activity={caseNoteWithMentions} allUsers={allUsers} />
      </Provider>
    );

    expect(wrapper.contains(<b>@Sabrina Sanchez (DPM)</b>)).toEqual(true);
    expect(wrapper.contains(<b>@sabrina sanchez</b>)).toEqual(true);
    expect(wrapper.contains(<b>@Veronica Blackwell</b>)).toEqual(true);
    expect(wrapper.contains(<span> notes, hey </span>)).toEqual(true);
    expect(wrapper.contains(<span> more notes </span>)).toEqual(true);
    expect(wrapper.contains(<span>, but while we're @it</span>)).toEqual(true);
  });
});
