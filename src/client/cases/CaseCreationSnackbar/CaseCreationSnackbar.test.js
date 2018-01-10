import React from 'react'
import { Provider } from 'react-redux'
import store from '../../reduxStore'
import { mount } from 'enzyme/build/index'
import CaseCreationSnackbar from './CaseCreationSnackbar'
import { createCaseSuccess, requestCaseCreation } from '../actionCreators'
import { expectEventuallyNotToExist } from '../../../testHelpers'

describe('CaseCreationSnackbar', () => {
    let caseCreationSnackbar

    beforeEach(() => {
        caseCreationSnackbar = mount(
        <Provider store={store}>
            <CaseCreationSnackbar />
        </Provider>
        )
    })

    test('should not be visible initially', () => {
        const resultMessage = caseCreationSnackbar.find('[data-test="creationSnackbarBannerText"]')
        expect(resultMessage.exists()).toEqual(false)
    })

    test('should be visible with success message after successful creation', () => {
        store.dispatch(requestCaseCreation())
        store.dispatch(createCaseSuccess({ id: 1234 }))
        caseCreationSnackbar.update()

        const resultMessage = caseCreationSnackbar.find('[data-test="creationSnackbarBannerText"]')

        expect(resultMessage.text()).toEqual('Case 1234 was successfully created.')
    })

    test('should dismiss snackbar', async () => {
        store.dispatch(requestCaseCreation())
        store.dispatch(createCaseSuccess({ id: 1234 }))
        caseCreationSnackbar.update()

        const dismissButton = caseCreationSnackbar.find('button[data-test="closeSnackbar"]')
        dismissButton.simulate('click')

        await expectEventuallyNotToExist(
            caseCreationSnackbar,
            '[data-test="creationSnackbarBannerText"]'
        )
    })
})