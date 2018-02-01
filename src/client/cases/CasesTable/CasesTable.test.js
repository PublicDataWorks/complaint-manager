import CasesTable from './CasesTable'
import React from 'react'
import {mount} from "enzyme/build/index"
import {Provider} from 'react-redux'
import createConfiguredStore from "../../createConfiguredStore"
import {createCaseSuccess, getCasesSuccess, updateSort} from '../actionCreators'
import {BrowserRouter as Router} from 'react-router-dom'
import {TableSortLabel} from "material-ui";

jest.mock('../thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))

describe('cases table', () => {
    let tableWrapper, cases, store, dispatchSpy;

    beforeEach(() => {
        cases = [{
            id: 17,
            complainantType: 'Civilian',
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            createdAt: new Date(2015, 8, 13).toISOString(),
            firstContactDate: "2017-12-25T00:00:00.000Z"
        }, {
            id: 24,
            complainantType: 'Civilian',
            firstName: 'Ariel',
            lastName: 'Pink',
            status: 'Initial',
            createdAt: new Date().toISOString()
        }];

        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')
        store.dispatch(getCasesSuccess(cases))

        tableWrapper = mount(
            <Provider store={store}>
                <Router>
                    <CasesTable/>
                </Router>
            </Provider>
        )
    });

    describe('table sorting', () => {
        test('should update sort by when case # number clicked', () => {
            const caseNumberLabel = tableWrapper.find('[data-test="caseNumberSortLabel"]').last()
            caseNumberLabel.simulate('click')

            expect(dispatchSpy).toHaveBeenCalledWith(updateSort('id'))
        })

        test('should update sort by when status clicked', () => {
            const caseNumberLabel = tableWrapper.find('[data-test="statusSortLabel"]').last()
            caseNumberLabel.simulate('click')

            expect(dispatchSpy).toHaveBeenCalledWith(updateSort('status'))
        })
    });

    describe('column headers', () => {
        let caseNumber, complainantType, status, complainant, caseCreatedOn

        beforeEach(() => {
            caseNumber = tableWrapper.find('th[data-test="casesNumberHeader"]');
            complainantType = tableWrapper.find('th[data-test="casesComplainantTypeHeader"]');
            status = tableWrapper.find('th[data-test="casesStatusHeader"]');
            complainant = tableWrapper.find('th[data-test="casesComplainantHeader"]');
            caseCreatedOn = tableWrapper.find('th[data-test="casesFirstContactDateHeader"]');
        })

        test('should display case number', () => {
            expect(caseNumber.text()).toEqual('Case #');
        })

        test('should display status', () => {
            expect(status.text()).toEqual('Status');
        })
        test('should display complainant', () => {
            expect(complainant.text()).toEqual('Complainant');
        })
        test('should display first contact date', () => {
            expect(caseCreatedOn.text()).toEqual('First Contact Date');
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

        test('should display status', () => {
            const status = caseRow.find('td[data-test="caseStatus"]');
            expect(status.text()).toEqual('Initial')
        });

        test('should display name', () => {
            const name = caseRow.find('td[data-test="caseName"]');
            expect(name.text()).toEqual('Berry, C.');
        });

        test('should display first contact date', () => {
            const firstContactDate = caseRow.find('td[data-test="caseFirstContactDate"]');
            expect(firstContactDate.text()).toEqual('Dec 25, 2017');
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

        test('should remain in numeric descending order by case # after creation', () => {
            const yetAnotherCase = {
                id: 50,
                complainantType: 'Civilian',
                firstName: 'Buck',
                lastName: 'Cherry',
                status: 'Initial',
                createdAt: new Date(2015, 8, 15).toISOString()
            }

            store.dispatch(createCaseSuccess(yetAnotherCase))
            tableWrapper.update()

            const rows = tableWrapper.find('TableBody').find('TableRow')
            const firstRow = rows.at(0)

            expect(firstRow.find('TableCell').at(0).text()).toEqual(`${yetAnotherCase.id}`)
        })
    })
})
