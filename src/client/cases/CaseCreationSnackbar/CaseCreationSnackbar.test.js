import React from 'react'
import {Provider} from 'react-redux'
import CaseCreationSnackbar from "./CaseCreationSnackbar";
import {mount} from "enzyme";
import store from "../../reduxStore";
import CreationSnackbar from "../../sharedComponents/CreationSnackbar";

describe('connected CaseCreationSnackbar', () => {
    let snackbarWrapper
    let snackbar

    beforeEach(() => {
        snackbarWrapper = mount(
            <Provider store={store}>
                <CaseCreationSnackbar/>
            </Provider>
        )

        snackbar = snackbarWrapper.find(CreationSnackbar)
    })

    test('should map inProgress from state', () => {
        expect(snackbar.prop('inProgress')).toBeDefined()
    })

    test('should map creationSuccess from state', () => {
        expect(snackbar.prop('creationSuccess')).toBeDefined()
    })

    test('should map message from state', () => {
        expect(snackbar.prop('message')).toBeDefined()
    })
})