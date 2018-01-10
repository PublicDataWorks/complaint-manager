import React from 'react'
import { Provider } from 'react-redux'
import store from "../../reduxStore"
import {mount} from "enzyme/build/index"
import {expectEventuallyNotToExist} from "../../../testHelpers"
import UserCreationSnackbar from "./UserCreationSnackbar"
import {createUserSuccess, requestUserCreation} from "../actionCreators";

describe('UserCreationSnackbar', () => {
    let userCreationSnackbar

    beforeEach(() => {
        userCreationSnackbar = mount(
            <Provider store={store}>
                <UserCreationSnackbar />
            </Provider>
        )
    })

    test('should not be visible initially', () => {
        const resultMessage = userCreationSnackbar.find('[data-test="creationSnackbarBannerText"]')
        expect(resultMessage.exists()).toEqual(false)
    })

    test('should be visible with success message after successful creation', () => {
        store.dispatch(requestUserCreation())
        store.dispatch(createUserSuccess({user: 'user'}))
        userCreationSnackbar.update()

        const resultMessage = userCreationSnackbar.find('[data-test="creationSnackbarBannerText"]')

        expect(resultMessage.text()).toEqual('User was successfully created.')
    })

    test('should dismiss snackbar', async () => {
        store.dispatch(requestUserCreation())
        store.dispatch(createUserSuccess({user: 'user'}))
        userCreationSnackbar.update()

        const dismissButton = userCreationSnackbar.find('button[data-test="closeSnackbar"]')
        dismissButton.simulate('click')

        await expectEventuallyNotToExist(
            userCreationSnackbar,
            '[data-test="creationSnackbarBannerText"]'
        )
    })
})