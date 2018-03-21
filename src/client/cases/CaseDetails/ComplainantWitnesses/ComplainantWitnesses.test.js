import React from 'react'
import {containsText} from "../../../../testHelpers";
import ComplainantWitnesses from "./ComplainantWitnesses";
import {mount} from "enzyme";
import {openEditDialog} from "../../../actionCreators/casesActionCreators";
import createConfiguredStore from "../../../createConfiguredStore";
import {initialize} from "redux-form";
import formatAddress from "../../../utilities/formatAddress";
import Civilian from "../../../testUtilities/civilian";
import Case from "../../../testUtilities/case";
import formatName from "../../../utilities/formatName";

jest.mock('redux-form', () => ({
    reducer: {mockReducer: 'mockReducerState'},
    initialize: jest.fn(() => ({
        type: "MOCK_INITIALIZE_ACTION",
    }))
}))

describe('Complainant and Witnesses', () => {
    let complainantWitnessesSection, complainantWitnesses, complainantPanel, caseDetail, dispatchSpy, primaryComplainant
    beforeEach(() => {
        primaryComplainant = new Civilian.Builder().defaultCivilian()
            .withBirthDate('')
            .withRaceEthnicity(undefined)
            .withGenderIdentity(undefined)
            .build()

        caseDetail = new Case.Builder().defaultCase()
            .withCivilians([primaryComplainant])
            .build()

        const store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseDetail} dispatch={dispatchSpy}/>)
        complainantWitnessesSection = complainantWitnesses.find('[data-test="complainantWitnessesSection"]').first()
        complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
    })

    describe('full name', () => {
        test('should display civilian role on case', () => {
            containsText(complainantWitnessesSection, '[data-test="primaryComplainantLabel"]', primaryComplainant.roleOnCase)
        })

        test('should display civilian first and last name', () => {
            const primaryComplainantName = formatName(primaryComplainant)
            containsText(complainantWitnessesSection, '[data-test="primaryComplainantName"]', primaryComplainantName)
        })
    });

    describe('gender identity', () => {
        test('should display N/A when no gender identity', () => {
            const genderIdentity = `N/A`

            containsText(complainantWitnessesSection, '[data-test="genderIdentity"]', genderIdentity)
        })
    });

    describe('race/ethnicity', () => {
        test('should display Race/Ethnicity as N/A', () => {
            const raceEthnicity = `N/A`

            containsText(complainantWitnessesSection, '[data-test="raceEthnicity"]', raceEthnicity)
        })
    });

    describe('Edit', () => {
        test('should open and initialize edit complainant dialog when edit is clicked', () => {
            const editLink = complainantWitnesses.find('[data-test="editComplainantLink"]').first()
            editLink.simulate('click');

            expect(dispatchSpy).toHaveBeenCalledWith(openEditDialog())
            expect(initialize).toHaveBeenCalledWith('EditCivilian', primaryComplainant)
        })
    })

    describe('birthday', () => {
        test('should display N/A when not set', () => {
            containsText(complainantWitnessesSection, '[data-test="primaryComplainantBirthday"]', 'N/A')
        })
    });

    describe('phone number', () => {
        test('should display phone number expanded', () => {
            const expectedPhoneNumber = '(123) 456-7890'
            containsText(complainantPanel, '[data-test="primaryComplainantPhoneNumber"]', expectedPhoneNumber)
        })

        test('should display N/A when no phone number ', () => {
            const civilianWithNoPhoneNumber = new Civilian.Builder().defaultCivilian()
                .withPhoneNumber(undefined)
                .build()

            const caseWithNoPhoneNumber = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoPhoneNumber])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoPhoneNumber}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantPhoneNumber"]', 'N/A')
        })
    });

    describe('email', () => {
        test('should display email when expanded', () => {
            const complainantPanel = complainantWitnessesSection.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantEmail"]', primaryComplainant.email)
        })

        test('should display N/A when no email', () => {
            const civilianWithNoEmail = new Civilian.Builder().defaultCivilian()
                .withEmail(undefined)
                .build()

            const caseWithNoEmail = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoEmail])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoEmail}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantEmail"]', 'N/A')
        })
    });

    describe('address', () => {
        test('should display N/A when no address', () => {
            const civilianWithNoAddress = new Civilian.Builder().defaultCivilian()
                .withNoAddress()
                .build()

            const caseWithNoAddress = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoAddress])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoAddress}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantAddress"]', 'No address specified')
        })
        test('should display address when present', () => {
            const expectedAddress = formatAddress(caseDetail.civilians[0].address)

            containsText(complainantPanel, '[data-test="primaryComplainantAddress"]', expectedAddress)
        })
    });

    describe('additional address info', () => {
        test('should be empty when no address', () => {
            const civilianWithNoAddress = new Civilian.Builder().defaultCivilian()
                .withNoAddress()
                .build()

            const caseWithNoAddress = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoAddress])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoAddress}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantAdditionalAddressInfo"]', '')
        })
        test('should display additional address info when present', () => {
            containsText(complainantPanel, '[data-test="primaryComplainantAdditionalAddressInfo"]', caseDetail.civilians[0].address.streetAddress2)
        })
    });

    describe('additional info', () => {
        test('should display N/A when no additional info', () => {
            const civilianWithNoAdditionalInfo = new Civilian.Builder().defaultCivilian()
                .withAdditionalInfo(undefined)
                .build()

            const caseWithNoAdditionalInfo = new Case.Builder().defaultCase()
                .withCivilians([civilianWithNoAdditionalInfo])
                .build()

            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoAdditionalInfo}/>)

            complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantAdditionalInfo"]', '')
        })

        test('should display additional info when present', () => {
            containsText(complainantPanel, '[data-test="primaryComplainantAdditionalInfo"]', primaryComplainant.additionalInfo)
        })
    })
})