import React from 'react';
import createConfiguredStore from "../../createConfiguredStore";
import {mount} from "enzyme/build/index";
import CaseDetails from "./CaseDetails";
import {Provider} from 'react-redux';
import NavBar from "../../sharedComponents/NavBar";
import {BrowserRouter as Router} from "react-router-dom";
import {containsText} from "../../../testHelpers";
import {mockLocalStorage} from "../../../mockLocalStorage";
import Case from "../../testUtilities/case";
import getCaseDetails from "../thunks/getCaseDetails";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";

jest.mock('../thunks/getCaseDetails', () => () => ({
    type: 'MOCK_GET_CASE_DETAILS'
}))

jest.mock('../thunks/updateNarrative', () => () => ({
    type: 'MOCK_UPDATE_NARRATIVE_THUNK'
}))

jest.mock("./CivilianDialog/SuggestionEngines/addressSuggestionEngine")

describe('Case Details Component', () => {
    let caseDetails, expectedCase, dispatchSpy, store;
    beforeEach(() => {
        const incidentDateInUTC = "2017-12-25T06:00Z"
        mockLocalStorage()

        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch');

        expectedCase = new Case.Builder().defaultCase().withId(612).withNarrativeDetails('Some initial narrative').withIncidentDate(incidentDateInUTC).build()

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
            const expectedFormattedName = `Case #612`

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

        test("should display Case # as a default section title", () => {
            containsText(caseDetails, '[data-test="case-number"]', `Case #612`)
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