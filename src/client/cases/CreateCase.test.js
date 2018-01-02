import React from 'react'
import { Provider } from 'react-redux'
import store from "../reduxStore";
import {mount} from "enzyme/build/index";
import {createCase} from "./actionCreators";
import CreateCase from "./CreateCase";

jest.mock('./actionCreators', () => ({
    createCase: (caseDetails) => ({
        type: 'MOCK_CREATE_CASE_THUNK',
        caseDetails
    })
}))

describe('CreateCase component', () => {
    let createCaseComponent;

    beforeEach(() => {
        createCaseComponent = mount(
            <Provider store={store}>
                <CreateCase/>
            </Provider>
        );
    })

    test('should create case when form is submitted', () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }
        const dispatchSpy = jest.spyOn(store, 'dispatch')

        const createCaseButton = createCaseComponent.find('button[data-test="createCaseButton"]')
        createCaseButton.simulate('click')

        const form = createCaseComponent.find('[data-test="createCaseForm"]')
        const firstName = form.find('[data-test="firstNameInput"] > input')
        const lastName = form.find('[data-test="lastNameInput"] > input')

        firstName.simulate('change', {target: {value: caseDetails.firstName}})
        lastName.simulate('change', {target: {value: caseDetails.lastName}})
        form.simulate('submit')

        expect(dispatchSpy).toHaveBeenCalledWith(createCase(caseDetails))
    })
})