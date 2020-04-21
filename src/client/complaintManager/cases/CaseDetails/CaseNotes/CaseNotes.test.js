import React from "react";
import { mount } from "enzyme";
import CaseNotes from "./CaseNotes";
import moment from "moment";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCaseNotesSuccess } from "../../../actionCreators/casesActionCreators";

describe("Case Notes", () => {
  const caseNoteActions = {
    memoToFile: ["Memo to file", 1],
    contactedOutsideAgency: ["Contacted outside agency", 2]
  };

  test("should display placeholder text when no case notes", () => {
    const caseNotes = [];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Router>
          <CaseNotes caseId={1} dispatch={jest.fn()} caseNotes={caseNotes} />
        </Router>
      </Provider>
    );

    containsText(
      wrapper,
      '[data-testid="caseNotesContainer"]',
      "No case notes have been added"
    );
  });

  test("should display case notes", () => {
    const someCaseNotes = [
      {
        id: 1,
        caseId: 1,
        author: { name: "tuser", email: "some@test.com" },
        caseNoteAction: {
          name: caseNoteActions.memoToFile[0],
          id: caseNoteActions.memoToFile[1]
        },
        actionTakenAt: new Date("December 17, 1995 03:24:00").toISOString()
      }
    ];

    const store = createConfiguredStore();

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseNotes caseId={1} dispatch={jest.fn()} />
        </Router>
      </Provider>
    );

    store.dispatch(getCaseNotesSuccess(someCaseNotes));

    wrapper.update();

    const activityContainer = wrapper
      .find('[data-testid="caseNotesContainer"]')
      .first();
    const activityItems = activityContainer
      .find('[data-testid="caseNotesItem"]')
      .first();

    const activityItem = activityItems.at(0);

    const userAndActionText = activityItem
      .find('[data-testid="userAndActionText"]')
      .first();
    const activityTimeText = activityItem
      .find('[data-testid="activityTimeText"]')
      .first();

    expect(userAndActionText.text()).toEqual("tuser Memo to file");
    expect(activityTimeText.text()).toEqual("Dec 17, 1995 3:24 AM");
  });

  test("should display most case notes first ", () => {
    const someCaseNotes = [
      {
        id: 1,
        caseId: 1,
        author: { name: "tuser", email: "some@test.com" },
        caseNoteAction: {
          name: caseNoteActions.memoToFile[0],
          id: caseNoteActions.memoToFile[1]
        },
        actionTakenAt: moment().subtract(3, "days")
      },
      {
        id: 3,
        caseId: 1,
        author: { name: "fooUser", email: "some@test.com" },
        caseNoteAction: {
          name: caseNoteActions.contactedOutsideAgency[0],
          id: caseNoteActions.contactedOutsideAgency[1]
        },
        notes: "some notes",
        actionTakenAt: moment().subtract(1, "hours")
      }
    ];

    const store = createConfiguredStore();
    store.dispatch(getCaseNotesSuccess(someCaseNotes));

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseNotes
            caseId={1}
            dispatch={jest.fn()}
            caseNotes={someCaseNotes}
          />
        </Router>
      </Provider>
    );

    const activityContainer = wrapper
      .find('[data-testid="caseNotesContainer"]')
      .first();
    const activityItems = activityContainer.find(
      '[data-testid="caseNotesItem"]'
    );

    const firstActivity = activityItems.first();
    const firstUserAndActivityActionText = firstActivity
      .find('[data-testid="userAndActionText"]')
      .first()
      .text();
    const secondActivity = activityItems.last();
    const secondUserAndActivityActionText = secondActivity
      .find('[data-testid="userAndActionText"]')
      .first()
      .text();

    expect(firstUserAndActivityActionText).toEqual(
      `fooUser ${caseNoteActions.contactedOutsideAgency[0]}`
    );
    expect(secondUserAndActivityActionText).toEqual(
      `tuser ${caseNoteActions.memoToFile[0]}`
    );
  });
});
