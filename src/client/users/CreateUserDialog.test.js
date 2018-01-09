import React from 'react'
import CreateUserDialog from './CreateUserDialog'
import {mount, shallow} from 'enzyme'
import {expectEventuallyNotToExist} from '../../testHelpers'
import {Provider} from 'react-redux'
import store from "../reduxStore";
import createUser from "./thunks/createUser";

jest.mock('./thunks/createUser', () => (userDetails) => ({
    type: 'MOCK_CREATE_USER_THUNK',
    userDetails
}))

describe('CreateUserDialog', () => {
    let dialog

    beforeEach(() => {
        dialog = mount(
            <Provider store={store}>
                <CreateUserDialog/>
            </Provider>
        )
    })

    test('should not display the dialog before the create user button is clicked', () => {
        let dialogTitle = dialog.find('[data-test="createUserDialogTitle"]')

        expect(dialogTitle.exists()).toEqual(false)
    })

    test('should dismiss when cancel button clicked', async () => {
        let addUserButton = dialog.find('button[data-test="createUserButton"]')
        addUserButton.simulate('click')

        const cancelButton = dialog.find('button[data-test="cancelUser"]')
        cancelButton.simulate('click')

        await expectEventuallyNotToExist(dialog, '[data-test="createUserDialogTitle"]')
    })

    test('should create user when form is submitted', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        const createUserButton = dialog.find('button[data-test="createUserButton"]')
        createUserButton.simulate('click')

        const userDetails = {
            firstName: 'Leeroy',
            lastName: 'Jenkins',
            email: 'ljenkins@thoughtworks.com'
        }

        const firstName = dialog.find('input[data-test="firstNameInput"]')
        const lastName = dialog.find('input[data-test="lastNameInput"]')
        const email = dialog.find('input[data-test="emailInput"]')
        const submitButton = dialog.find('button[data-test="submitUser"]')

        firstName.simulate('change', {target: {value: userDetails.firstName}})
        lastName.simulate('change', {target: {value: userDetails.lastName}})
        email.simulate('change', {target: {value: userDetails.email}})
        submitButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(createUser(userDetails))
    })

})
