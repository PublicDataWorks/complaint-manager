import React from "react";
import { mount } from "enzyme";
import CaseNotes from "./CaseNotes";
import moment from "moment";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import {
  fetchingCaseNotes,
  getCaseNotesSuccess
} from "../../../actionCreators/casesActionCreators";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

describe("Case Notes", () => {
  let store;

  const caseNoteActions = {
    memoToFile: ["Memo to file", 1],
    contactedOutsideAgency: ["Contacted outside agency", 2]
  };

  beforeEach(() => {
    store = createConfiguredStore();
  });

  [
    {
      name: "view case history",
      permission: USER_PERMISSIONS.VIEW_CASE_HISTORY,
      text: "View Case History"
    },
    {
      name: "add case note",
      permission: USER_PERMISSIONS.CREATE_CASE_NOTE,
      text: "+ Add Case Note"
    }
  ].forEach(perm => {
    test(`${perm.name} button is displayed`, () => {
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [perm.permission] }
      });
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseNotes caseId={1} dispatch={jest.fn()} />
          </Router>
        </Provider>
      );

      expect(wrapper.text().includes(perm.text)).toBeTrue();
    });

    test(`${perm.name} button is not displayed`, () => {
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.EXPORT_AUDIT_LOG] }
      });
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseNotes caseId={1} dispatch={jest.fn()} />
          </Router>
        </Provider>
      );

      expect(wrapper.text().includes(perm.text)).toBeFalse();
    });
  });

  test("should display placeholder text when no case notes", () => {
    const caseNotes = [];

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseNotes caseId={1} dispatch={jest.fn()} caseNotes={caseNotes} />
        </Router>
      </Provider>
    );

    containsText(wrapper, '[data-testid="caseNotesContainer"]', "");

    store.dispatch(fetchingCaseNotes(false));

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

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseNotes caseId={1} dispatch={jest.fn()} />
        </Router>
      </Provider>
    );

    store.dispatch(getCaseNotesSuccess(someCaseNotes));

    containsText(wrapper, '[data-testid="caseNotesContainer"]', "");

    store.dispatch(fetchingCaseNotes(false));

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

  test("should display most recent case notes first ", () => {
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

    store.dispatch(getCaseNotesSuccess(someCaseNotes));
    store.dispatch(fetchingCaseNotes(false));
    wrapper.update();

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
