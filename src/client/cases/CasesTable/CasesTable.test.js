import CasesTable from './CasesTable'
import React from 'react'
import {mount} from "enzyme/build/index"
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore"
import {getCasesSuccess} from '../actionCreators'
import {BrowserRouter as Router} from 'react-router-dom'

jest.mock('../thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))

describe('cases table', () => {
    let table, cases;

    beforeEach(() => {
        cases = [{
            id: 17,
            incidentType: 'Citizen Complaint',
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            createdAt: new Date(2015, 8, 13).toISOString()
        }, {
            id: 24,
            incidentType: 'Officer Complaint',
            firstName: 'Ariel',
            lastName: 'Pink',
            status: 'Initial',
            createdAt: new Date().toISOString()
        }];

        const store = createConfiguredStore()
        store.dispatch(getCasesSuccess(cases));

        table = mount(
            <Provider store={store}>
                <Router>
                    <CasesTable/>
                </Router>
            </Provider>
        )
    });

    describe('column headers', () => {
        let caseNumber, incidentType, status, complainant, caseCreatedOn

        beforeEach(() => {
            caseNumber = table.find('th[data-test="casesNumberHeader"]');
            incidentType = table.find('th[data-test="casesIncidentTypeHeader"]');
            status = table.find('th[data-test="casesStatusHeader"]');
            complainant = table.find('th[data-test="casesComplainantHeader"]');
            caseCreatedOn = table.find('th[data-test="casesCreatedOnHeader"]');
        })

        test('should display case number', () =>{
            expect(caseNumber.text()).toEqual('Case #');
        })

        test('should display incident type', () => {
            expect(incidentType.text()).toEqual('Incident Type')
        })

        test('should display status', () =>{
            expect(status.text()).toEqual('Status');
        })
        test('should display complainant', () =>{
            expect(complainant.text()).toEqual('Complainant');
        })
        test('should display created on', () =>{
            expect(caseCreatedOn.text()).toEqual('Created On');
        })

    });

    describe('displaying a case', () => {
        let caseRow;

        beforeEach(() => {
            caseRow = table.find('tr[data-test="caseRow17"]')
        });

        test('should display id', () => {
            const number = caseRow.find('td[data-test="caseNumber"]');
            expect(number.text()).toEqual('17')
        });

        test('should display incident type', () => {
            const incidentType = caseRow.find('td[data-test="incidentType"]')
            expect(incidentType.text()).toEqual('Citizen Complaint')
        })

        test('should display status', () => {
            const status = caseRow.find('td[data-test="caseStatus"]');
            expect(status.text()).toEqual('Initial')
        });

        test('should display name', () => {
            const name = caseRow.find('td[data-test="caseName"]');
            expect(name.text()).toEqual('Berry, C.');
        });

        test('should display created at date', () => {
            const createdAt = caseRow.find('td[data-test="caseCreatedAt"]');
            expect(createdAt.text()).toEqual('Sep 13, 2015');
        });

        test('should display an open case button', () => {
            const openCaseButton = caseRow.find('[data-test="openCaseButton"]');
            expect(openCaseButton.exists()).toEqual(true);
        });

        test.skip('should display open case button to the far right of the row', () => {
            const openCaseCell = caseRow.find('td[data-test="openCase"]');
            expect(openCaseCell).toHaveProperty('style.textAlign','right');
        });

        test('open case button should refer to the case detail page', () => {
            const openCaseButton = caseRow.find('a[data-test="openCaseButton"]');
            expect(openCaseButton.prop('href')).toEqual('/case/17');
        });

        test('should display multiple cases', () => {
            const otherCaseRow = table.find('tr[data-test="caseRow24"]');
            expect(otherCaseRow.exists()).toEqual(true);
        });
    })
})
