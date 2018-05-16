import React from "react";
import { mount } from "enzyme";
import RecentActivity from "./RecentActivity";
import moment from "moment";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import {BrowserRouter as Router} from 'react-router-dom'

describe("Recent Activity", () => {
  test("should display placeholder text when no recent activity", () => {
    const recentActivity = [];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Router>
            <RecentActivity
              caseId={1}
              dispatch={jest.fn()}
              recentActivity={recentActivity}
            />
        </Router>
      </Provider>
    );

    containsText(
      wrapper,
      '[data-test="recentActivityContainer"]',
      "No case notes have been added"
    );
  });

  test("should display recent activity", () => {
    const someRecentActivity = [
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
            <RecentActivity
              caseId={1}
              dispatch={jest.fn()}
              recentActivity={someRecentActivity}
            />
        </Router>
      </Provider>
    );

    const activityContainer = wrapper
      .find('[data-test="recentActivityContainer"]')
      .first();
    const activityItems = activityContainer
      .find('[data-test="recentActivityItem"]')
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

  test("should display most recent activity first ", () => {
    const someRecentActivity = [
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
          <RecentActivity
            caseId={1}
            dispatch={jest.fn()}
            recentActivity={someRecentActivity}
          />
        </Router>
      </Provider>
    );

    const activityContainer = wrapper
      .find('[data-test="recentActivityContainer"]')
      .first();
    const activityItems = activityContainer.find(
      '[data-test="recentActivityItem"]'
    );

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
