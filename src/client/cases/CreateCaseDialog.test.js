import React from 'react'
import {Provider} from 'react-redux'
import store from "../reduxStore";
import {mount} from "enzyme/build/index";
import {createCaseSuccess} from "./actionCreators";
import CreateCaseDialog from "./CreateCaseDialog";
import {expectEventuallyNotToExist} from "../../testHelpers";
import createCase from "./thunks/createCase";

jest.mock('./thunks/createCase', () => (caseDetails) => ({
    type: 'MOCK_CREATE_CASE_THUNK',
    caseDetails
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
        dispatchSpy.mockClear()

        const createCaseButton = dialog.find('button[data-test="createCaseButton"]')
        createCaseButton.simulate('click')
    })

    test('should create case when form is submitted', () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }

        const firstName = dialog.find('input[data-test="firstNameInput"]')
        const lastName = dialog.find('input[data-test="lastNameInput"]')
        const submitButton = dialog.find('button[data-test="submitCase"]')

        firstName.simulate('change', {target: {value: caseDetails.firstName}})
        lastName.simulate('change', {target: {value: caseDetails.lastName}})
        submitButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(createCase(caseDetails))
    })

    test('should dismiss dialog when cancel button is clicked', async () => {
        const cancel = dialog.find('button[data-test="cancelCase"]')
        cancel.simulate('click')

        await expectEventuallyNotToExist(dialog, '[data-test="createCaseDialogTitle"]')
    })

    test('should dismiss dialog after successful case creation', async () => {
        store.dispatch(createCaseSuccess({id: 1234}))

        await expectEventuallyNotToExist(dialog, '[data-test="createCaseDialogTitle"]')
    })

    test('first name should have max length of 25 characters', () => {
        const firstName = dialog.find('input[data-test="firstNameInput"]')
        expect(firstName.props().maxLength).toEqual(25)
    })

    test('first name should not use autoComplete', () => {
        const firstName = dialog.find('input[data-test="firstNameInput"]')
        expect(firstName.props().autoComplete).toEqual('off')
    })

    test('last name should have max length of 25 characters', () => {
        const lastName = dialog.find('input[data-test="lastNameInput"]')
        expect(lastName.props().maxLength).toEqual(25)
    })

    test('last name should not use autoComplete', () => {
        const lastName = dialog.find('input[data-test="lastNameInput"]')
        expect(lastName.props().autoComplete).toEqual('off')
    })

    test('whitespace should be trimmed from fields prior to sending', () => {
        const firstName = dialog.find('input[data-test="firstNameInput"]')
        const lastName = dialog.find('input[data-test="lastNameInput"]')
        const submitButton = dialog.find('button[data-test="submitCase"]')

        firstName.simulate('change', {target: {value: '   Fats   '}})
        lastName.simulate('change', {target: {value: '   Domino   '}})
        submitButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(
            createCase({
                firstName: 'Fats',
                lastName: 'Domino'
            }))
    })
})