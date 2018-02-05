import React from 'react'
import {mount} from "enzyme/build/index";
import {Provider} from 'react-redux'
import SharedSnackbar from "../../sharedComponents/SharedSnackbar";
import createConfiguredStore from "../../createConfiguredStore";
import CaseDetailSnackbar from "./CaseDetailSnackbar";

describe('connected CaseCreationSnackbar', () => {
    let snackbarWrapper
    let snackbar
    let store

    beforeEach(() => {
        store = createConfiguredStore()
        snackbarWrapper = mount(
            <Provider store={store}>
                <CaseDetailSnackbar/>
            </Provider>
        )

        snackbar = snackbarWrapper.find(SharedSnackbar)
    })

    test('should map success from state', () => {
        expect(snackbar.prop('success')).toBeDefined()
    })

    test('should map message from state', () => {
        expect(snackbar.prop('message')).toBeDefined()
    })

    test('should map dispatch to props', () => {
        expect(snackbar.prop('closeSnackbar')).toBeDefined()
    })

    test('map open from state', () => {
        expect(snackbar.prop('open')).toBeDefined()
    })
})