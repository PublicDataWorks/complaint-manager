import React from 'react'
import {mount} from 'enzyme'
import RecentActivity from "./RecentActivity";
import moment from "moment";

describe('Recent Activity', () => {
    test('should display recent activity', () => {
        const someRecentActivity = [
            {
                id: 1,
                caseId: 1,
                user: 'tuser',
                action: 'Created case',
                createdAt: moment().subtract(3, 'days')
            }
        ]

        const wrapper = mount(
            <RecentActivity
                caseId={1}
                dispatch={jest.fn()}
                recentActivity={someRecentActivity}
            />
        )

        const activityContainer = wrapper.find('[data-test="recentActivityContainer"]').first()
        const activityItems = activityContainer.find('[data-test="recentActivityItem"]').first()

        const activityItem = activityItems.at(0)

        const activityText = activityItem.find('[data-test="actionText"]').first()
        const userText = activityItem.find('[data-test="userText"]').first()
        const activityTimeText = activityItem.find('[data-test="activityTimeText"]').first()

        expect(activityText.text()).toEqual('Created case')
        expect(userText.text()).toEqual('tuser')
        expect(activityTimeText.text()).toEqual('3 days ago')
    })

    test('should display most recent activity first ', () => {
        const someRecentActivity = [
            {
                id: 1,
                caseId: 1,
                user: 'tuser',
                action: 'Created case',
                createdAt: moment().subtract(3, 'days')
            }, {
                id: 3,
                caseId: 1,
                user: 'fooUser',
                action: 'Attachment added',
                createdAt: moment().subtract(1, 'hours')
            },

        ]

        const wrapper = mount(
            <RecentActivity
                caseId={1}
                dispatch={jest.fn()}
                recentActivity={someRecentActivity}
            />
        )

        const activityContainer = wrapper.find('[data-test="recentActivityContainer"]').first()
        const activityItems = activityContainer.find('[data-test="recentActivityItem"]')

        const firstActivity  =  activityItems.first()
        const firstActivityActionText  =  firstActivity.find('[data-test="actionText"]').first().text()
        const secondActivity = activityItems.last()
        const secondActivityActionText  =  secondActivity.find('[data-test="actionText"]').first().text()

        expect(firstActivityActionText).toEqual('Attachment added')
        expect(secondActivityActionText).toEqual('Created case')
    })
});