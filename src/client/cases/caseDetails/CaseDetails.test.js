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

jest.mock('../thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))
describe('Case Details Component', () => {
    let details, expectedCase, dispatchSpy;
    beforeEach(() => {
        let store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch');
        let cases = [{
            id: 17,
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            createdOn: formatDate(new Date(2015, 8, 13).toISOString()),
            createdBy: 'Some User',
            assignedTo: 'Another User'
        }];
        store.dispatch(getCasesSuccess(cases));
        expectedCase = cases[0]
        details = mount(
            <Provider store={store}>
                <Router>
                    <CaseDetails match={{params: {id: expectedCase.id.toString()}}}/>
                </Router>
            </Provider>
        )
    });

    test("should render a NavBar with Last Name, First Initial", () => {
        const navBar = details.find(NavBar);
        expect(navBar.exists()).toEqual(true);
        expect(!navBar.text().search("Berry, C.")).toEqual(true)
    })

    test("should provide an option to go back to all cases", () => {
        expect(details.find('LinkButton').text()).toEqual("Back to all Cases")
    })

    test("should display the case number in the left drawer", () => {
        expect(details.find('h3[data-test="case-number"]').text()).toEqual(`Case #${expectedCase.id}`)
    })

    test.skip("should display created on date in left drawer", () => {
        expect(details.find('td[data-test="created-on"]').text()).toEqual(`${expectedCase.createdOn}`)
    })

    test.skip("should display created by user in left drawer", () => {
        expect(details.find('td[data-test="created-by"]').text()).toEqual(`${expectedCase.createdBy}`)
    })

    test.skip("should display assigned to user in left drawer", () => {
        expect(details.find('td[data-test="assigned-to"]').text()).toEqual(`${expectedCase.assignedTo}`)
    })

    test.skip("should display case status next to name in NavBar", () => {
        expect().to("")
    })
});