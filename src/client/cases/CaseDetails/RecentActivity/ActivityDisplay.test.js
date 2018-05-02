import ActivityDisplay from "./ActivityDisplay";
import React from "react";
import {mount} from "enzyme";
import {containsText} from "../../../../testHelpers";
import moment from "moment";

describe('ActivityDisplay', () => {
    test('should be able to display user action', () => {
        const userAction = {
            id: 1,
            caseId:2,
            user: 'tuser',
            action: 'Miscellaneous',
            notes: 'notes',
            actionTakenAt: new Date().toISOString()
        }

       const wrapper = mount(<ActivityDisplay
           activity={userAction}
       />)

        containsText(wrapper, '[data-test="actionText"]', userAction.action)
        containsText(wrapper, '[data-test="userText"]', userAction.user)
        containsText(wrapper, '[data-test="activityTimeText"]', moment(userAction.actionTakenAt, "YYYY-MM-DDTHH:mm Z").fromNow())
        containsText(wrapper, '[data-test="notesText"]', userAction.notes)
    })
});