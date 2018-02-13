import React from 'react'
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore"
import {mount} from "enzyme"
import UserCreationSnackbar from "./UserCreationSnackbar"
import SharedSnackbar from "../../sharedComponents/SharedSnackbar";

describe('UserCreationSnackbar', () => {
    let userCreationSnackbar, snackbar

    beforeEach(() => {
        userCreationSnackbar = mount(
            <Provider store={createConfiguredStore()}>
                <UserCreationSnackbar />
            </Provider>
        )

        snackbar = userCreationSnackbar.find(SharedSnackbar)
    })

    test('map success from state', () => {
        expect(snackbar.prop('success')).toBeDefined()
    })

    test('map message from state', () => {
        expect(snackbar.prop('message')).toBeDefined()
    })

    test('map closeSnackbar() with dispatch to props', () => {
        expect(snackbar.prop('closeSnackbar')).toBeDefined()
    })

    test('map open from state', () => {
        expect(snackbar.prop('open')).toBeDefined()
    })
})