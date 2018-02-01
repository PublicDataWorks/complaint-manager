import React from 'react'
import CreateUserDialog from './CreateUserDialog'
import {mount} from 'enzyme'
import {changeInput, expectEventuallyNotToExist} from '../../../testHelpers'
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore";
import createUser from "../thunks/createUser";
import {createUserSuccess} from "../actionCreators";
import {openSnackbar} from "../../snackbar/actionCreators";

jest.mock('../thunks/createUser', () => (userDetails) => ({
    type: 'MOCK_CREATE_USER_THUNK',
    userDetails
}))

describe('CreateUserDialog', () => {
    let dialog, store

    beforeEach(() => {
        store = createConfiguredStore()

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

        changeInput(dialog, 'input[data-test="firstNameInput"]', userDetails.firstName);
        changeInput(dialog, 'input[data-test="lastNameInput"]', userDetails.lastName);
        changeInput(dialog, 'input[data-test="emailInput"]', userDetails.email);

        const submitButton = dialog.find('button[data-test="submitUser"]')
        submitButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(createUser(userDetails))
    })

    test("should not create user when form is submitted with invalid input", () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        const createUserButton = dialog.find('button[data-test="createUserButton"]')
        createUserButton.simulate('click')

        const userDetails = {
            firstName: '',
            lastName: '',
            email: ''
        }

        changeInput(dialog, 'input[data-test="firstNameInput"]', userDetails.firstName);
        changeInput(dialog, 'input[data-test="lastNameInput"]', userDetails.lastName);
        changeInput(dialog, 'input[data-test="emailInput"]', userDetails.email);

        const submitButton = dialog.find('button[data-test="submitUser"]')

        submitButton.simulate('click')

        expect(dispatchSpy).not.toHaveBeenCalledWith(createUser(userDetails))
    })

    test('should dismiss dialog after successful user creation', async () => {
        const createUserButton = dialog.find('button[data-test="createUserButton"]')
        createUserButton.simulate('click')

        store.dispatch(createUserSuccess({someUserProp: 'some user'}))

        await expectEventuallyNotToExist(dialog, '[data-test="createUserDialogTitle"]')
    })

    test('should dismiss visible snackbars when dialog is opened', () => {
        store.dispatch(openSnackbar())

        const createUserButton = dialog.find('button[data-test="createUserButton"]')
        createUserButton.simulate('click')

        expect(store.getState()).toHaveProperty("ui.snackbar.open", false)
    })
})
