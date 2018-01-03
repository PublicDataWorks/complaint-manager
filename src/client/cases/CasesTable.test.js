import CasesTable from './CasesTable'
import React from 'react'
import {mount} from "enzyme/build/index"
import { Provider } from 'react-redux'
import store from "../reduxStore"
import getCases from "./thunks/getCases";

jest.mock('./thunks/getCases', () => () => ({
    type: 'MOCK_GET_CASES_THUNK'
}))

describe('cases table', () => {
    let casesTable
    let dispatchSpy

    beforeEach(() => {
        dispatchSpy = jest.spyOn(store, 'dispatch')

        casesTable = mount(
            <Provider store={store}>
                <CasesTable/>
            </Provider>
        )
    })

    test('should display header columns when rendered', () => {
        let caseNumberHeader = casesTable.find('th[data-test="casesNumberHeader"]')
        let caseStatusHeader = casesTable.find('th[data-test="casesStatusHeader"]')
        let caseComplainantHeader = casesTable.find('th[data-test="casesComplainantHeader"]')
        let caseCreatedOnHeader = casesTable.find('th[data-test="casesCreatedOnHeader"]')

        expect(caseNumberHeader.text()).toEqual('Case #')
        expect(caseStatusHeader.text()).toEqual('Status')
        expect(caseComplainantHeader.text()).toEqual('Complainant')
        expect(caseCreatedOnHeader.text()).toEqual('Created On')
    })

    test('should show 0 cases when no cases are passed in by props', () => {
      let tableRow = casesTable.find('tr[data-test="casesTableEntry"]')
      expect(tableRow.exists()).toEqual(false);

    })

    test('should load all cases', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(getCases())
    })
})