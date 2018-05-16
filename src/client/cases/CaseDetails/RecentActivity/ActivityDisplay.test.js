import ActivityDisplay from "./ActivityDisplay";
import React from "react";
import {mount} from "enzyme";
import {containsText} from "../../../../testHelpers";
import createConfiguredStore from "../../../createConfiguredStore";
import {Provider} from "react-redux";

describe('ActivityDisplay', () => {
    test('should be able to display user action', () => {
        const userAction = {
            id: 1,
            caseId: 2,
            user: 'tuser',
            action: 'Miscellaneous',
            notes: 'notes',
            actionTakenAt: new Date().toISOString()
        }

        const wrapper = mount(
            <Provider store={createConfiguredStore()}>
                <ActivityDisplay
                    activity={userAction}/>
            </Provider>)

        containsText(wrapper, '[data-test="userAndActionText"]', userAction.action)
        containsText(wrapper, '[data-test="userAndActionText"]', userAction.user)
        containsText(wrapper, '[data-test="activityTimeText"]', "a few seconds ago")
        containsText(wrapper, '[data-test="notesText"]', userAction.notes)
    })
});