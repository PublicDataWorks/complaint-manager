import React from 'react';
import {mount} from 'enzyme';
import { Provider } from 'react-redux'

import ViewAllCases from "./ViewAllCases";
import store from "../reduxStore"
import { createCase } from './actionCreators'

jest.mock('./actionCreators', () => ({
    createCase: (caseDetails) => ({
        type: 'MOCK_CREATE_CASE_THUNK',
        caseDetails
    })
}))

describe('ViewAllCases component', () => {
    let viewAllCases;

    beforeEach(() => {
        viewAllCases = mount(
            <Provider store={store}>
                <ViewAllCases/>
            </Provider>
        );
    })

    test('should display title', () => {
        const pageTitle = viewAllCases.find('h2[data-test="pageTitle"]');
        expect(pageTitle.text()).toEqual('View All Cases')
    });

    test('should create case when form is submitted', () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        const createCaseButton = viewAllCases.find('button[data-test="createCaseButton"]')
        createCaseButton.simulate('click')

        const form = viewAllCases.find('[data-test="createCaseForm"]')
        const firstName = form.find('[data-test="firstNameInput"] > input')
        const lastName = form.find('[data-test="lastNameInput"] > input')

        firstName.simulate('change', { target: { value: caseDetails.firstName }})
        lastName.simulate('change', { target: { value: caseDetails.lastName }})
        form.simulate('submit')

        expect(dispatchSpy).toHaveBeenCalledWith(createCase(caseDetails))
    })

    // setup state in tests by dispatching actions
    // example:
    // store.dispatch(caseCreationFailure())
    // then mount the component and assert that failure banner is visible
});