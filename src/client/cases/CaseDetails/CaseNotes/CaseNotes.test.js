import React from "react";
import { mount } from "enzyme";
import CaseNotes from "./CaseNotes";
import moment from "moment";
import { containsText } from "../../../testHelpers";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

describe("Case Notes", () => {
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
      '[data-test="caseNotesContainer"]',
      "No case notes have been added"
    );
  });

  test("should display case notes", () => {
    const someCaseNotes = [
      {
        id: 1,
        caseId: 1,
        user: "tuser",
        action: "Created case",
        actionTakenAt: moment().subtract(3, "days")
      }
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
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
      .find('[data-test="caseNotesContainer"]')
      .first();
    const activityItems = activityContainer
      .find('[data-test="caseNotesItem"]')
      .first();

    const activityItem = activityItems.at(0);

    const userAndActionText = activityItem
      .find('[data-test="userAndActionText"]')
      .first();
    const activityTimeText = activityItem
      .find('[data-test="activityTimeText"]')
      .first();

    expect(userAndActionText.text()).toEqual("[tuser] Created case");
    expect(activityTimeText.text()).toEqual("3 days ago");
  });

  test("should display most case notes first ", () => {
    const someCaseNotes = [
      {
        id: 1,
        caseId: 1,
        user: "tuser",
        action: "Created case",
        actionTakenAt: moment().subtract(3, "days")
      },
      {
        id: 3,
        caseId: 1,
        user: "fooUser",
        action: "Attachment added",
        notes: "some notes",
        actionTakenAt: moment().subtract(1, "hours")
      }
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
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
      .find('[data-test="caseNotesContainer"]')
      .first();
    const activityItems = activityContainer.find('[data-test="caseNotesItem"]');

    const firstActivity = activityItems.first();
    const firstUserAndActivityActionText = firstActivity
      .find('[data-test="userAndActionText"]')
      .first()
      .text();
    const secondActivity = activityItems.last();
    const secondUserAndActivityActionText = secondActivity
      .find('[data-test="userAndActionText"]')
      .first()
      .text();

    expect(firstUserAndActivityActionText).toEqual(
      "[fooUser] Attachment added"
    );
    expect(secondUserAndActivityActionText).toEqual("[tuser] Created case");
  });
});
