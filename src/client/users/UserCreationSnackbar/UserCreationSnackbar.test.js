import React from 'react'
import { Provider } from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore"
import {mount} from "enzyme"
import UserCreationSnackbar from "./UserCreationSnackbar"
import CreationSnackbar from "../../sharedComponents/CreationSnackbar";

describe('UserCreationSnackbar', () => {
    let userCreationSnackbar, snackbar

    beforeEach(() => {
        userCreationSnackbar = mount(
            <Provider store={createConfiguredStore()}>
                <UserCreationSnackbar />
            </Provider>
        )

        snackbar = userCreationSnackbar.find(CreationSnackbar)
    })

    test('map inProgress from state', () => {
        expect(snackbar.prop('inProgress')).toBeDefined()
    })

    test('map creationSuccess from state', () => {
        expect(snackbar.prop('creationSuccess')).toBeDefined()
    })

    test('map message from state', () => {
        expect(snackbar.prop('message')).toBeDefined()
    })

})