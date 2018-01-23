import CasesTable from './CasesTable'
import React from 'react'
import {mount} from "enzyme/build/index"
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore"
import {createCaseSuccess, getCasesSuccess, redirectToCaseDetail} from '../actionCreators'
import {BrowserRouter as Router, Redirect} from 'react-router-dom'

jest.mock('../thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))

describe('cases table', () => {
    let tableWrapper, cases, store;

    beforeEach(() => {
        cases = [{
            id: 17,
            complainantType: 'Civilian',
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            createdAt: new Date(2015, 8, 13).toISOString()
        }, {
            id: 24,
            complainantType: 'Civilian',
            firstName: 'Ariel',
            lastName: 'Pink',
            status: 'Initial',
            createdAt: new Date().toISOString()
        }];

        store = createConfiguredStore()
        store.dispatch(getCasesSuccess(cases))

        tableWrapper = mount(
            <Provider store={store}>
                <Router>
                    <CasesTable/>
                </Router>
            </Provider>
        )
    });

    describe('Case Detail Redirect', () => {
        test('should render all cases when a case is created but not waiting to redirect', () => {
            const newCase = {
                id: 25,
                complainantType: 'Civilian',
                firstName: 'Artie',
                lastName: 'Blue',
                status: 'Initial',
                createdAt: new Date().toISOString()
            }

            store.dispatch(createCaseSuccess(newCase))
            tableWrapper.update()

            expect(tableWrapper.find('table[data-test="allCasesTable"]').exists()).toBeTruthy()
        })

        test('should render all cases when waiting to redirect but case has not yet been created', () => {
            store.dispatch(redirectToCaseDetail())
            tableWrapper.update()

            expect(tableWrapper.find('table[data-test="allCasesTable"]').exists()).toBeTruthy()
        })

        test('should redirect to case detail when waiting to redirect and case was successfully created', () => {
            const newCase = {
                id: 25,
                complainantType: 'Civilian',
                firstName: 'Artie',
                lastName: 'Blue',
                status: 'Initial',
                createdAt: new Date().toISOString()
            }

            store.dispatch(createCaseSuccess(newCase))
            store.dispatch(redirectToCaseDetail())
            tableWrapper.update()

            expect(tableWrapper.find('table[data-test="allCasesTable"]').exists()).toBeFalsy()
            const redirect = tableWrapper.find(Redirect).instance();
            expect (redirect.props).toHaveProperty('to', '/case/25')
        })
    });
    
    describe('column headers', () => {
        let caseNumber, complainantType, status, complainant, caseCreatedOn

        beforeEach(() => {
            caseNumber = tableWrapper.find('th[data-test="casesNumberHeader"]');
            complainantType = tableWrapper.find('th[data-test="casesComplainantTypeHeader"]');
            status = tableWrapper.find('th[data-test="casesStatusHeader"]');
            complainant = tableWrapper.find('th[data-test="casesComplainantHeader"]');
            caseCreatedOn = tableWrapper.find('th[data-test="casesCreatedOnHeader"]');
        })

        test('should display case number', () => {
            expect(caseNumber.text()).toEqual('Case #');
        })

        test('should display complainant type', () => {
            expect(complainantType.text()).toEqual('Complainant Type')
        })

        test('should display status', () => {
            expect(status.text()).toEqual('Status');
        })
        test('should display complainant', () => {
            expect(complainant.text()).toEqual('Complainant');
        })
        test('should display created on', () => {
            expect(caseCreatedOn.text()).toEqual('Created On');
        })

    });

    describe('displaying a case', () => {
        let caseRow;

        beforeEach(() => {
            caseRow = tableWrapper.find('tr[data-test="caseRow17"]')
        });

        test('should display id', () => {
            const number = caseRow.find('td[data-test="caseNumber"]');
            expect(number.text()).toEqual('17')
        });

        test('should display complainant type', () => {
            const complainantType = caseRow.find('td[data-test="complainantType"]')
            expect(complainantType.text()).toEqual('Civilian')
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

        test('open case button should refer to the case detail page', () => {
            const openCaseButton = caseRow.find('a[data-test="openCaseButton"]');
            expect(openCaseButton.prop('href')).toEqual('/case/17');
        });

        test('should display multiple cases', () => {
            const otherCaseRow = tableWrapper.find('tr[data-test="caseRow24"]');
            expect(otherCaseRow.exists()).toEqual(true);
        });
    })
})
