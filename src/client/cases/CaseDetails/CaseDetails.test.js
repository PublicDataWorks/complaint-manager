import React from 'react';
import createConfiguredStore from "../../createConfiguredStore";
import {mount} from "enzyme/build/index";
import CaseDetails from "./CaseDetails";
import {Provider} from 'react-redux';
import NavBar from "../../sharedComponents/NavBar";
import {BrowserRouter as Router} from "react-router-dom";
import {changeInput, containsText} from "../../../testHelpers";
import updateNarrative from "../thunks/updateNarrative";
import {mockLocalStorage} from "../../../mockLocalStorage";
import Case from "../../testUtilities/case";
import formatName from "../../utilities/formatName";
import getPrimaryComplainant from "../../utilities/getPrimaryComplainant";
import getCaseDetails from "../thunks/getCaseDetails";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";

jest.mock('../thunks/getCaseDetails', () => () => ({
    type: 'MOCK_GET_CASE_DETAILS'
}))

jest.mock('../thunks/updateNarrative', () => () => ({
    type: 'MOCK_UPDATE_NARRATIVE_THUNK'
}))

jest.mock("./EditCivilianDialog/SuggestionEngines/addressSuggestionEngine")

describe('Case Details Component', () => {
    let caseDetails, expectedCase, dispatchSpy, store;
    beforeEach(() => {
        const incidentDateInUTC = "2017-12-25T06:00Z"
        mockLocalStorage()

        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch');

        expectedCase = new Case.Builder().defaultCase().withNarrativeDetails('Some initial narrative').withIncidentDate(incidentDateInUTC).build()

        store.dispatch(getCaseDetailsSuccess(expectedCase));

        caseDetails = mount(
            <Provider store={store}>
                <Router>
                    <CaseDetails match={{params: {id: expectedCase.id.toString()}}}/>
                </Router>
            </Provider>
        )
    });

    test('should dispatch get case details action on mount', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(getCaseDetails(expectedCase.id.toString()))
    })

    describe('nav bar', () => {
        test("should display with Case number", () => {
            const navBar = caseDetails.find(NavBar);
            const expectedFormattedName = `Case #${expectedCase.id}`

            containsText(navBar, '[data-test="pageTitle"]', expectedFormattedName)
        })

        test("should display with case status", () => {
            const navBar = caseDetails.find(NavBar)
            containsText(navBar, '[data-test="caseStatusBox"]', expectedCase.status)
        })
    });

    describe('drawer', () => {
        test("should provide an option to go back to all cases", () => {
            containsText(caseDetails, '[data-test="all-cases-link"]', "Back to all Cases")
        })

        test("should display Case Details as a default section title", () => {
            containsText(caseDetails, '[data-test="case-number"]', `Case Details`)
        })

        test('should display incident date', () => {
            containsText(caseDetails, '[data-test="incident-date"]', `Dec 25, 2017`)
        })
        test('should display incident time', () => {
            containsText(caseDetails, '[data-test="incident-time"]', `12:00 AM CST`)
        })

        test('should display first contact date', () => {
           containsText(caseDetails, '[data-test="first-contact-date"]', "Dec 25, 2017")
        })

        test("should display created on date", () => {
            containsText(caseDetails, '[data-test="created-on"]', "Sep 13, 2015")
        })

        test('should display complaint type', () => {
            containsText(caseDetails, '[data-test="complainant-type"]', expectedCase.complainantType)
        })

        test("should display created by user", () => {
            containsText(caseDetails, '[data-test="created-by"]', expectedCase.createdBy)
        })

        test("should display assigned to user", () => {
            containsText(caseDetails, '[data-test="assigned-to"]', expectedCase.assignedTo)
        })
    });
});