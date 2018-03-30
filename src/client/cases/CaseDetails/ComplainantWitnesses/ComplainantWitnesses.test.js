import React from 'react'
import {containsText} from "../../../../testHelpers";
import ComplainantWitnesses from "./ComplainantWitnesses";
import {mount} from "enzyme";
import {openCivilianDialog} from "../../../actionCreators/casesActionCreators";
import createConfiguredStore from "../../../createConfiguredStore";
import {initialize} from "redux-form";
import formatAddress from "../../../utilities/formatAddress";
import Civilian from "../../../testUtilities/civilian";
import Case from "../../../testUtilities/case";
import formatName from "../../../utilities/formatName";
import editCivilian from "../../thunks/editCivilian";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";

jest.mock('redux-form', () => ({
    reducer: {mockReducer: 'mockReducerState'},
    initialize: jest.fn(() => ({
        type: "MOCK_INITIALIZE_ACTION",
    }))
}))

describe('Complainant and Witnesses', () => {
    let complainantWitnessesSection, complainantWitnesses, complainantPanel, caseDetail, dispatchSpy, complainant
    beforeEach(() => {
        complainant = new Civilian.Builder().defaultCivilian()
            .withBirthDate('')
            .withRaceEthnicity(undefined)
            .withGenderIdentity(undefined)
            .build()

        caseDetail = new Case.Builder().defaultCase()
            .withCivilians([complainant])
            .build()

        const store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseDetail} dispatch={dispatchSpy}/>)
        complainantWitnessesSection = complainantWitnesses.find('[data-test="complainantWitnessesSection"]').first()
        complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
    })

    describe('full name', () => {
        test('should display civilian role on case', () => {
            containsText(complainantWitnessesSection, '[data-test="complainantLabel"]', complainant.roleOnCase)
        })

        test('should display civilian first and last name', () => {
            const complainantName = formatName(complainant)
            containsText(complainantWitnessesSection, '[data-test="complainant"]', complainantName)
        })
    });


    describe('Edit', () => {
        test('should open and initialize edit complainant dialog when edit is clicked', () => {
            const editLink = complainantWitnesses.find('[data-test="editComplainantLink"]').first()
            editLink.simulate('click');

            expect(dispatchSpy).toHaveBeenCalledWith(openCivilianDialog("Edit Civilian", "Save", editCivilian))
            expect(initialize).toHaveBeenCalledWith(CIVILIAN_FORM_NAME, complainant)
        })
    })

    describe('phone number', () => {
        test('should display phone number expanded', () => {
            const expectedPhoneNumber = '(123) 456-7890'
            containsText(complainantPanel, '[data-test="complainantPhoneNumber"]', expectedPhoneNumber)
        })
    });

    describe('email', () => {
        test('should display email when expanded', () => {
            const complainantPanel = complainantWitnessesSection.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="complainantEmail"]', complainant.email)
        })
    });

    describe('address', () => {
        test('should display N/A when no address', () => {
            const civilianWithNoAddress = new Civilian.Builder().defaultCivilian()
                .withClearedOutAddress()
                .build()

            const caseWithNoAddress = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoAddress])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoAddress}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="complainantAddress"]', 'No address specified')
        })
        test('should display address when present', () => {
            const expectedAddress = formatAddress(caseDetail.civilians[0].address)

            containsText(complainantPanel, '[data-test="complainantAddress"]', expectedAddress)
        })
    });

    describe('additional address info', () => {
        test('should be empty when no address', () => {
            const civilianWithNoAddress = new Civilian.Builder().defaultCivilian()
                .withClearedOutAddress()
                .build()

            const caseWithNoAddress = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoAddress])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoAddress}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="complainantAdditionalAddressInfo"]', '')
        })
        test('should display additional address info when present', () => {
            containsText(complainantPanel, '[data-test="complainantAdditionalAddressInfo"]', caseDetail.civilians[0].address.streetAddress2)
        })
    });

    describe('additional info', () => {
        test('should display additional info when present', () => {
            containsText(complainantPanel, '[data-test="complainantAdditionalInfo"]', complainant.additionalInfo)
        })
    })
})