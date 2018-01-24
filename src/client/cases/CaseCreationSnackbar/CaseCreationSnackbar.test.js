import React from 'react'
import {Provider} from 'react-redux'
import CaseCreationSnackbar from "./CaseCreationSnackbar";
import {mount} from "enzyme";
import createConfiguredStore from "../../createConfiguredStore";
import CreationSnackbar from "../../sharedComponents/CreationSnackbar";

describe('connected CaseCreationSnackbar', () => {
    let snackbarWrapper
    let snackbar

    beforeEach(() => {
        snackbarWrapper = mount(
            <Provider store={createConfiguredStore()}>
                <CaseCreationSnackbar/>
            </Provider>
        )

        snackbar = snackbarWrapper.find(CreationSnackbar)
    })

    test('should map creationSuccess from state', () => {
        expect(snackbar.prop('creationSuccess')).toBeDefined()
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