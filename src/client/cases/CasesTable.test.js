import CasesTable from './CasesTable'
import React from 'react'
import {mount} from "enzyme/build/index";

describe('cases table', () => {
    test('should display header columns when rendered', () => {
        let casesTable = mount(<CasesTable />)

        let caseNumberHeader = casesTable.find('th[data-test="casesNumberHeader"]')
        let caseStatusHeader = casesTable.find('th[data-test="casesStatusHeader"]')
        let caseComplainantHeader = casesTable.find('th[data-test="casesComplainantHeader"]')
        let caseCreatedOnHeader = casesTable.find('th[data-test="casesCreatedOnHeader"]')

        expect(caseNumberHeader.text()).toEqual('Case #')
        expect(caseStatusHeader.text()).toEqual('Status')
        expect(caseComplainantHeader.text()).toEqual('Complainant')
        expect(caseCreatedOnHeader.text()).toEqual('Created On')
    })

    test('should show one case when one case is passed in by props', () => {
        let cases = [{id:1234, status:'Initial', firstName:'Foo', lastName:'Bar', createdOn:Date()}]
        let casesTable = mount(<CasesTable cases={cases}/>)
        let tableRow = casesTable.find('tr[data-test="casesTableEntry"]')
        expect(tableRow.exists()).toEqual(true);
    })

    test('should show 0 cases when no cases are passed in by props', () => {
      let casesTable = mount(<CasesTable/>)
      let tableRow = casesTable.find('tr[data-test="casesTableEntry"]')
      expect(tableRow.exists()).toEqual(false);

    })
})