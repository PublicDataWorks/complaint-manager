import React from 'react';
import createConfiguredStore from "../../createConfiguredStore";
import {getCasesSuccess} from "../actionCreators";
import {mount} from "enzyme/build/index";
import CaseDetails from "./CaseDetails";
import {Provider} from 'react-redux';
import NavBar from "../../sharedComponents/NavBar";
import {BrowserRouter as Router} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import formatDate from "../../formatDate";
import {changeInput, containsText} from "../../../testHelpers";
import updateNarrative from "../thunks/updateNarrative";
import moment from "moment";

jest.mock('../thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))

jest.mock('../thunks/updateNarrative', () => () => ({
    type: 'MOCK_UPDATE_NARRATIVE_THUNK'
}))
describe('Case Details Component', () => {
    let caseDetails, expectedCase, dispatchSpy, store;
    beforeEach(() => {
        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch');
        let cases = [{
            id: 17,
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            phoneNumber: 1234567890,
            email: 'cberry@gmail.com',
            complainantType: 'Civilian',
            firstContactDate: '2018-01-31',
            createdAt: new Date(2015, 8, 13).toISOString(),
            createdBy: 'not added',
            assignedTo: 'not added',
            narrative: 'sample narrative'
        }];
        store.dispatch(getCasesSuccess(cases));
        expectedCase = cases[0]
        caseDetails = mount(
            <Provider store={store}>
                <Router>
                    <CaseDetails match={{params: {id: expectedCase.id.toString()}}}/>
                </Router>
            </Provider>
        )
    });

    describe('nav bar', () => {
        test("should display with Last Name, First Initial", () => {
            const navBar = caseDetails.find(NavBar);
            containsText(navBar, '[data-test="pageTitle"]', 'Berry, C.')
        })

        test("should display with case status", () => {
            const navBar = caseDetails.find(NavBar)
            containsText(navBar, '[data-test="caseStatusBox"]', expectedCase.status)
        })
    });

    describe('drawer', () => {
        test("should provide an option to go back to all cases", () => {
            containsText(caseDetails, 'LinkButton', "Back to all Cases")
        })

        test("should display the case number", () => {
            containsText(caseDetails, '[data-test="case-number"]', `Case #${expectedCase.id}`)
        })

        test('should display first contact date', () => {
           containsText(caseDetails, '[data-test="first-contact-date"]', formatDate(expectedCase.firstContactDate))
        })

        test("should display created on date", () => {
            containsText(caseDetails, '[data-test="created-on"]', formatDate(moment(expectedCase.createdAt).format('YYYY-MM-DD')))
        })

        test('should display complaint type', () => {
            containsText(caseDetails, '[data-test="complaint-type"]', expectedCase.complainantType)
        })

        test("should display created by user", () => {
            containsText(caseDetails, '[data-test="created-by"]', expectedCase.createdBy)
        })

        test("should display assigned to user", () => {
            containsText(caseDetails, '[data-test="assigned-to"]', expectedCase.assignedTo)
        })

    });

    describe('main content', () => {
        describe('narrative', () => {
            test('should have an initial value', () => {
                containsText(caseDetails, '[data-test="narrativeInput"]', expectedCase.narrative)
            })

            test('should update case narrative when save button is clicked', () => {
                const updateDetails = {
                    narrative: 'sample narrative with additional details.',
                    id: expectedCase.id
                }

                changeInput(caseDetails, 'textarea[data-test="narrativeInput"]', updateDetails.narrative)

                const saveButton = caseDetails.find('button[data-test="saveNarrative"]')
                saveButton.simulate('click')

                expect(dispatchSpy).toHaveBeenCalledWith(updateNarrative(updateDetails))
            })

            test('should disable the submit button when pristine', () => {
                const saveButton = caseDetails.find('button[data-test="saveNarrative"]')
                saveButton.simulate('click')

                const defaultValues = {
                    narrative: caseDetails.narrative,
                    id: caseDetails.id
                }

                expect(dispatchSpy).not.toHaveBeenCalledWith(updateNarrative(defaultValues))
            })
        })
    });
});