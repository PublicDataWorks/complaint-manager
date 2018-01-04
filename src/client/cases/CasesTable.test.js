import CasesTable from './CasesTable'
import React from 'react'
import {mount} from "enzyme/build/index"
import { Provider } from 'react-redux'
import store from "../reduxStore"
import getCases from "./thunks/getCases";
import { getCasesSuccess } from './actionCreators'

jest.mock('./thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))

describe('cases table', () => {
    let table, cases, dispatchSpy

    beforeEach(() => {
        dispatchSpy = jest.spyOn(store, 'dispatch')

        cases = [{
            id: 17,
            firstName: 'Chuck',
            lastName: 'Berry',
            status: 'Initial',
            createdAt: new Date(2015, 8, 13).toISOString()
        }, {
            id: 24,
            firstName: 'Ariel',
            lastName: 'Pink',
            status: 'Initial',
            createdAt: new Date().toISOString()
        }]

        store.dispatch(getCasesSuccess(cases))
        table = mount(
            <Provider store={store}>
                <CasesTable/>
            </Provider>
        )
    })

    test('should display column headers', () => {
        let caseNumberHeader = table.find('th[data-test="casesNumberHeader"]')
        let caseStatusHeader = table.find('th[data-test="casesStatusHeader"]')
        let caseComplainantHeader = table.find('th[data-test="casesComplainantHeader"]')
        let caseCreatedOnHeader = table.find('th[data-test="casesCreatedOnHeader"]')

        expect(caseNumberHeader.text()).toEqual('Case #')
        expect(caseStatusHeader.text()).toEqual('Status')
        expect(caseComplainantHeader.text()).toEqual('Complainant')
        expect(caseCreatedOnHeader.text()).toEqual('Created On')
    })

    test('should load all cases when mounted', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(getCases())
    })

    describe('displaying a case', () => {
        let caseRow

        beforeEach(() => {
            caseRow = table.find('tr[data-test="caseRow17"]')
        })

        test('should display id', () => {
            const number = caseRow.find('td[data-test="caseNumber"]')
            expect(number.text()).toEqual('17')
        })

        test('should display status', () => {
            const status = caseRow.find('td[data-test="caseStatus"]')
            expect(status.text()).toEqual('Initial')
        })

        test('should display name', () => {
            const name = caseRow.find('td[data-test="caseName"]')
            expect(name.text()).toEqual('Berry, C.')
        })

        test('should display created at date', () => {
            const createdAt = caseRow.find('td[data-test="caseCreatedAt"]')
            expect(createdAt.text()).toEqual('Sep 13, 2015')
        })

        test('should display multiple cases', () => {
            const otherCaseRow = table.find('tr[data-test="caseRow24"]')
            expect(otherCaseRow.exists()).toEqual(true)
        })
    })
})
