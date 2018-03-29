import React from 'react'
import IncidentDetailsContainer from "./IncidentDetailsContainer";
import {mount} from "enzyme";
import IncidentDetails from "./IncidentDetails";
import createConfiguredStore from "../../../createConfiguredStore";
import {Provider} from "react-redux";
import {getCaseDetailsSuccess} from "../../../actionCreators/casesActionCreators";
import Case from "../../../testUtilities/case";

describe('incident details container', () => {
    let incidentDetails, currentCase
    beforeEach(() => {
        const store = createConfiguredStore()

        currentCase = new Case.Builder()
            .defaultCase()
            .withIncidentDate("1994-04-24T17:30:00.000Z")
            .build()

        store.dispatch(getCaseDetailsSuccess(currentCase))
        const wrapper = mount(
            <Provider store={store}>
                <IncidentDetailsContainer/>
            </Provider>
        )
        incidentDetails = wrapper.find(IncidentDetails)
    });

    test('should pass first contact date', () => {
        expect(incidentDetails.prop('firstContactDate')).toEqual(currentCase.firstContactDate)
    })
    test('should pass incident date', () => {
        const expectedIncidentDate = 'Apr 24, 1994'
        expect(incidentDetails.prop('incidentDate')).toEqual(expectedIncidentDate)
    })

    test('should pass incident time', () => {
        const expectedIncidentTime = "12:30 PM CDT"
        expect(incidentDetails.prop('incidentTime')).toEqual(expectedIncidentTime)
    })
});