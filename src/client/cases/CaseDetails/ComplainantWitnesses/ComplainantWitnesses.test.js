import React from 'react'
import {containsText} from "../../../../testHelpers";
import ComplainantWitnesses from "./ComplainantWitnesses";
import {mount} from "enzyme";
import {openEditDialog} from "../../actionCreators";
import createConfiguredStore from "../../../createConfiguredStore";
import {initialize} from "redux-form";

jest.mock('redux-form', () => ({
    reducer: { mockReducer: 'mockReducerState' },
    initialize: jest.fn(() => ({
        type: "MOCK_INITIALIZE_ACTION",
    }))
}))

describe('Complainant and Witnesses', () => {
    let complainantWitnessesSection, complainantWitnesses, caseDetail, dispatchSpy, primaryComplainant
    beforeEach(() => {
        primaryComplainant = {
            id: 17,
            firstName: 'Chuck',
            lastName: 'Berry',
            phoneNumber: 1234567890,
            email: 'cberry@gmail.com',
            roleOnCase: 'Primary Complainant',
            birthDate: null
        }

        caseDetail = {
            id: 17,
            civilians: [primaryComplainant],
            status: 'Initial',
            complainantType: 'Civilian',
            firstContactDate: '2018-01-31',
            createdAt: new Date(2015, 8, 13).toISOString(),
            createdBy: 'not added',
            assignedTo: 'not added',
            narrative: 'sample narrative'
        }

        const store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseDetail} dispatch={dispatchSpy}/>)
        complainantWitnessesSection = complainantWitnesses.find('[data-test="complainantWitnessesSection"]').first()
    })

    describe('full name', () => {
        test('should display civilian role on case', () => {
            containsText(complainantWitnessesSection, '[data-test="primaryComplainantLabel"]', primaryComplainant.roleOnCase)
        })

        test('should display civilian first and last name', () => {
            const primaryComplainantName = `${primaryComplainant.firstName} ${primaryComplainant.lastName}`
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
        test('should open edit complainant dialog when edit is clicked', () => {
            const editLink = complainantWitnesses.find('[data-test="editComplainantLink"]').first()
            editLink.simulate('click');

            expect(dispatchSpy).toHaveBeenCalledWith(openEditDialog())
        })

        test('should not initialize form with falsy values', () =>{
            const editLink = complainantWitnesses.find('[data-test="editComplainantLink"]').first()
            editLink.simulate('click');

            const expectedValuesWithoutNullBirthday = {
                id: 17,
                    firstName: 'Chuck',
                lastName: 'Berry',
                phoneNumber: 1234567890,
                email: 'cberry@gmail.com',
                roleOnCase: 'Primary Complainant'
            }

            expect(initialize).toHaveBeenCalledWith('EditCivilian', expectedValuesWithoutNullBirthday)
        })
    })

    describe('birthday', () => {
        test('should display N/A when not set', () => {
            containsText(complainantWitnessesSection, '[data-test="primaryComplainantBirthday"]', 'N/A')
        })
    });

    describe('phone number', () => {
        test('should display phone number expanded', () => {
            const complainantPanel = complainantWitnessesSection.find('[data-test="complainantWitnessesPanel"]').first()
            const expectedPhoneNumber = '(123) 456-7890'
            containsText(complainantPanel, '[data-test="primaryComplainantPhoneNumber"]', expectedPhoneNumber)
        })

        test('should display N/A when no phone number ', () => {
            const caseWithNoPhoneNumber = {
                id: 17,
                civilians: [{
                    firstName: 'John',
                    lastName: 'Doe',
                    status: 'Initial',
                    phoneNumber: null,
                    email: 'cberry@gmail.com',
                    roleOnCase: 'Primary Complainant'
                }],
                complainantType: 'Civilian',
                firstContactDate: '2018-01-31',
                createdAt: new Date(2015, 8, 13).toISOString(),
                createdBy: 'not added',
                assignedTo: 'not added',
                narrative: 'sample narrative'
            }
            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoPhoneNumber}/>)

            const complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantPhoneNumber"]', 'N/A')
        })
    });

    describe('email', () => {
        test('should display email when expanded', () => {
            const complainantPanel = complainantWitnessesSection.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantEmail"]', primaryComplainant.email)
        })

        test('should display N/A when no email', () => {
            const caseWithNoEmail = {
                id: 17,
                civilians: [{
                    firstName: 'John',
                    lastName: 'Doe',
                    status: 'Initial',
                    phoneNumber: 1234567890,
                    email: null,
                    roleOnCase: 'Primary Complainant'
                }],
                complainantType: 'Civilian',
                firstContactDate: '2018-01-31',
                createdAt: new Date(2015, 8, 13).toISOString(),
                createdBy: 'not added',
                assignedTo: 'not added',
                narrative: 'sample narrative'
            }
            complainantWitnesses = mount(<ComplainantWitnesses caseDetail={caseWithNoEmail}/>)

            const complainantPanel = complainantWitnesses.find('[data-test="complainantWitnessesPanel"]').first()
            containsText(complainantPanel, '[data-test="primaryComplainantEmail"]', 'N/A')
        })
    });

})