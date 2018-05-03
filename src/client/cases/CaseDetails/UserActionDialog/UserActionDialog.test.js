import React from 'react'
import mount from 'enzyme/mount'
import UserActionDialog from "./UserActionDialog";
import createConfiguredStore from "../../../createConfiguredStore";
import {Provider} from "react-redux";
import {
    closeUserActionDialog, getCaseDetailsSuccess,
    openUserActionDialog
} from "../../../actionCreators/casesActionCreators";
import {changeInput, selectDropdownOption} from "../../../../testHelpers";
import addUserAction from "../../thunks/addUserAction";
import timezone from 'moment-timezone'
import {TIMEZONE} from "../../../../sharedUtilities/constants";
import {reset} from "redux-form";

jest.mock("../../thunks/addUserAction", () => (values) => ({
    type: 'MOCK_THUNK',
    values
}))

describe('UserActionDialog', () => {
    test('should close dialog and reset form when cancel button is clicked', () => {
        const store = createConfiguredStore()
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        store.dispatch(openUserActionDialog())

        const wrapper = mount(
            <Provider store={store}>
                <UserActionDialog/>
            </Provider>
        )

        const closeButton = wrapper.find('[data-test="cancelButton"]').first()
        closeButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(closeUserActionDialog())
        expect(dispatchSpy).toHaveBeenCalledWith(reset('UserActions'))
    })

    test('should submit form when Add Case Note is clicked', () => {
        const store = createConfiguredStore()
        const dispatchSpy = jest.spyOn(store, 'dispatch')
        const caseId = 12
        store.dispatch(openUserActionDialog())
        store.dispatch(getCaseDetailsSuccess({
            id: caseId
        }))

        const wrapper = mount(
            <Provider store={store}>
                <UserActionDialog/>
            </Provider>
        )

        const date = timezone.tz(new Date(Date.now()), TIMEZONE).format()
        const submittedValues = {
            caseId: caseId,
            actionTakenAt: date,
            action: 'Miscellaneous',
            notes: 'these are notes'
        }

        changeInput(wrapper, '[data-test="dateAndTimeInput"]', submittedValues.actionTakenAt)
        selectDropdownOption(wrapper, '[data-test="actionsDropdown"]', submittedValues.action)
        changeInput(wrapper, '[data-test="notesInput"]', submittedValues.notes)

        const submitButton = wrapper.find('[data-test="submitButton"]').first()
        submitButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(addUserAction(submittedValues))
    })

    test('should not submit form when Add Case Note is clicked and no action is selected', () => {
        const store = createConfiguredStore()
        const dispatchSpy = jest.spyOn(store, 'dispatch')
        const caseId = 12

        store.dispatch(openUserActionDialog())

        const wrapper = mount(
            <Provider store={store}>
                <UserActionDialog caseId={caseId}/>
            </Provider>
        )

        const submittedValues = {
            caseId: caseId,
            actionTakenAt: timezone.tz(new Date(Date.now()), TIMEZONE).format(),
        }

        const submitButton = wrapper.find('[data-test="submitButton"]').first()
        submitButton.simulate('click')

        expect(dispatchSpy).not.toHaveBeenCalledWith(addUserAction(submittedValues))
    })
});
