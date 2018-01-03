import React from 'react'
import { Provider } from 'react-redux'
import store from "../reduxStore";
import {mount} from "enzyme/build/index";
import {createCaseSuccess} from "./actionCreators";
import CreateCaseDialog from "./CreateCaseDialog";
import {expectNotToEventuallyExist} from "../../testHelpers";
import {createCase} from "./thunks";

jest.mock('./thunks', () => ({
    createCase: (caseDetails) => ({
        type: 'MOCK_CREATE_CASE_THUNK',
        caseDetails
    })
}))

describe('CreateCaseDialog component', () => {
    let dialog
    let dispatchSpy

    beforeEach(() => {
        dialog = mount(
            <Provider store={store}>
                <CreateCaseDialog/>
            </Provider>
        )

        dispatchSpy = jest.spyOn(store, 'dispatch')

        const createCaseButton = dialog.find('button[data-test="createCaseButton"]')
        createCaseButton.simulate('click')
    })

    test('should create case when form is submitted', () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }

        const form = dialog.find('[data-test="createCaseForm"]')
        const firstName = form.find('[data-test="firstNameInput"] > input')
        const lastName = form.find('[data-test="lastNameInput"] > input')

        firstName.simulate('change', {target: {value: caseDetails.firstName}})
        lastName.simulate('change', {target: {value: caseDetails.lastName}})
        form.simulate('submit')

        expect(dispatchSpy).toHaveBeenCalledWith(createCase(caseDetails))
    })

    test('should dismiss dialog when cancel button is clicked', async () => {
        const cancel = dialog.find('button[data-test="cancelCase"]')
        cancel.simulate('click')

        await expectNotToEventuallyExist(dialog, '[data-test="createCaseDialogTitle"]')
    })

    test('should dismiss dialog after successful case creation', async () => {
        store.dispatch(createCaseSuccess({id: 1234}))

        await expectNotToEventuallyExist(dialog, '[data-test="createCaseDialogTitle"]')
    })
})