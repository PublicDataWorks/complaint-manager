import {mount} from "enzyme";
import AccusedOfficers from "./AccusedOfficers";
import React from "react";
import Officer from "../../../testUtilities/Officer";
import CaseOfficer from "../../../testUtilities/caseOfficer";

describe('AccusedOfficers', function () {

    test('should display officers', ()=>{
        const anOfficer = new Officer.Builder().defaultOfficer().withFullName('Jerry Springfield').build()
        const accusedOfficers = [
            new CaseOfficer.Builder().defaultCaseOfficer().withOfficer(anOfficer).build()
        ]

        const wrapper = mount(
            <AccusedOfficers
                accusedOfficers={accusedOfficers}
            />
        )

        const officersDisplayed = wrapper.find('[data-test="officerPanel"]')
        const firstOfficer = officersDisplayed.first()

        expect(firstOfficer.text()).toContain(anOfficer.fullName)
    })
});