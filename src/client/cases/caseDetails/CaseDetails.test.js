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
import {containsText} from "../../../testHelpers";

jest.mock('../thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))
describe('Case Details Component', () => {
    let caseDetails, expectedCase, dispatchSpy;
    beforeEach(() => {
        let store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch');
        let cases = [{
            id: 17,
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            createdAt: formatDate(new Date(2015, 8, 13).toISOString()),
            createdBy: 'Placeholder',
            assignedTo: 'Placeholder'
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

    test("should render a NavBar with Last Name, First Initial", () => {
        const navBar = caseDetails.find(NavBar);
        containsText(navBar, '[data-test="pageTitle"]', 'Berry, C.')
    })

    test("should display case status next to name in NavBar", () => {
        const navBar = caseDetails.find(NavBar)
        containsText(navBar, '[data-test="caseStatusBox"]', expectedCase.status)
    })

    test("should provide an option to go back to all cases", () => {
        containsText(caseDetails, 'LinkButton', "Back to all Cases")
    })

    test("should display the case number in the left drawer", () => {
        containsText(caseDetails, '[data-test="case-number"]', `Case #${expectedCase.id}`)
    })

    test("should display created on date in left drawer", () => {
        containsText(caseDetails, '[data-test="created-on"]', expectedCase.createdAt)
    })

    test("should display created by user in left drawer", () => {
        containsText(caseDetails, '[data-test="created-by"]', expectedCase.createdBy)
    })

    test("should display assigned to user in left drawer", () => {
        containsText(caseDetails, '[data-test="assigned-to"]',expectedCase.assignedTo)
    })
});