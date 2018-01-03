import React from 'react'
import { Provider } from 'react-redux'
import store from '../reduxStore'
import { mount } from 'enzyme/build/index'
import CaseCreationMessage from './CaseCreationMessage'
import { createCaseSuccess, requestCaseCreation } from './actionCreators'
import { expectNotToEventuallyExist } from '../../testHelpers'

describe('CaseCreationMessage', () => {
    let caseCreationMessage

    beforeEach(() => {
        caseCreationMessage = mount(
        <Provider store={store}>
            <CaseCreationMessage/>
        </Provider>
        )
    })

    test('should be visible with success message after successful creation', () => {
        store.dispatch(requestCaseCreation())
        store.dispatch(createCaseSuccess({ id: 1234 }))
        caseCreationMessage.update()

        const resultMessage = caseCreationMessage.find('[data-test="createCaseBannerText"]')

        expect(resultMessage.text()).toEqual('Case 1234 was successfully created.')
    })

    test('should not be visible initially', () => {
        const resultMessage = caseCreationMessage.find('[data-test="createCaseBannerText"]')
        expect(resultMessage.exists()).toEqual(false)
    })

    test('should dismiss snackbar', async () => {
        store.dispatch(requestCaseCreation())
        store.dispatch(createCaseSuccess({ id: 1234 }))
        caseCreationMessage.update()

        const dismissButton = caseCreationMessage.find('button[data-test="closeSnackbar"]')
        dismissButton.simulate('click')

        await expectNotToEventuallyExist(
            caseCreationMessage,
            '[data-test="createCaseBannerText"]'
        )
    })
})