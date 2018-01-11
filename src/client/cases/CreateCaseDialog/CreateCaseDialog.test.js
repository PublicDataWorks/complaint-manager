import React from 'react'
import {Provider} from 'react-redux'
import store from "../../reduxStore";
import {mount} from "enzyme/build/index";
import {createCaseSuccess} from "../actionCreators";
import CreateCaseDialog from "./CreateCaseDialog";
import {expectEventuallyNotToExist} from "../../../testHelpers";
import createCase from "../thunks/createCase";

jest.mock('../thunks/createCase', () => (caseDetails) => ({
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
            lastName: 'Domino',
            phoneNumber: '0123456789',
            email: 'fdomino@gmail.com'
        }

        const firstName = dialog.find('input[data-test="firstNameInput"]')
        const lastName = dialog.find('input[data-test="lastNameInput"]')
        const phoneNumber = dialog.find('input[data-test="phoneNumberInput"]')
        const email = dialog.find('input[data-test="emailInput"]')
        const submitButton = dialog.find('button[data-test="submitCase"]')

        firstName.simulate('change', {target: {value: caseDetails.firstName}})
        lastName.simulate('change', {target: {value: caseDetails.lastName}})
        phoneNumber.simulate('change', {target: {value: caseDetails.phoneNumber}})
        email.simulate('change', {target: {value: caseDetails.email}})

        submitButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(createCase(caseDetails))
    })

    describe('dismissing dialog', () => {
        test('should dismiss when cancel button is clicked', async () => {
            const cancel = dialog.find('button[data-test="cancelCase"]')
            cancel.simulate('click')

            await expectEventuallyNotToExist(dialog, '[data-test="createCaseDialogTitle"]')
        })

        test('should dismiss after successful case creation', async () => {
            store.dispatch(createCaseSuccess({id: 1234}))

            await expectEventuallyNotToExist(dialog, '[data-test="createCaseDialogTitle"]')
        })
    })

    describe('fields', () => {
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
    })

    describe('trimming whitespace', () => {
        test('whitespace should be trimmed from fields prior to sending', () => {
            const firstName = dialog.find('input[data-test="firstNameInput"]')
            const lastName = dialog.find('input[data-test="lastNameInput"]')
            const submitButton = dialog.find('button[data-test="submitCase"]')

            firstName.simulate('change', {target: {value: '   Hello   '}})
            lastName.simulate('change', {target: {value: '   Kitty   '}})
            let dispatchSpy = jest.spyOn(store, 'dispatch')

            submitButton.simulate('click')

            expect(dispatchSpy).toHaveBeenCalledWith(
                createCase({
                    firstName: 'Hello',
                    lastName: 'Kitty'
                }))
        })

        test('whitespace should not be trimmed from empty fields', () => {
            const firstName = dialog.find('input[data-test="firstNameInput"]')
            const lastName = dialog.find('input[data-test="lastNameInput"]')
            const submitButton = dialog.find('button[data-test="submitCase"]')

            firstName.simulate('change', {target: {value: ''}})
            lastName.simulate('change', {target: {value: ''}})

            submitButton.simulate('click')

            expect(dispatchSpy).toHaveBeenCalledWith(
                createCase({
                    firstName: undefined,
                    lastName: undefined
                }))
        })
    })
})