import React from 'react'
import {containsText} from "../../../testHelpers";
import ComplainantWitnesses from "./ComplainantWitnesses";
import {mount} from "enzyme";
import {openEditDialog} from "../actionCreators";
import createConfiguredStore from "../../createConfiguredStore";

describe('complainant and witnesses', () => {
    let complainantWitnessesSection, complainantWitnesses, caseDetail, dispatchSpy, primaryComplainant
    beforeEach(() => {
        primaryComplainant = {
            id: 17,
            firstName: 'Chuck',
            lastName: 'Berry',
            phoneNumber: 1234567890,
            email: 'cberry@gmail.com',
            roleOnCase: 'Primary Complainant'
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

    describe('presentation tests', () => {
        test('should have a title Complainant & Witnesses', () => {
            containsText(complainantWitnessesSection, '[data-test="complainantWitnessesPanelTitle"]', 'Complainant & Witnesses')
        })

        test('should display primary complainants first and last name', () => {
            const primaryComplainantName = `${primaryComplainant.firstName} ${primaryComplainant.lastName}`

            containsText(complainantWitnessesSection, '[data-test="primaryComplainantName"]', primaryComplainantName)
        })

        test('should display Gender Identity as N/A', () => {
            const genderIdentity = `N/A`

            containsText(complainantWitnessesSection, '[data-test="genderIdentity"]', genderIdentity)
        })

        test('should display Race/Ethnicity as N/A', () => {
            const raceEthnicity = `N/A`

            containsText(complainantWitnessesSection, '[data-test="raceEthnicity"]', raceEthnicity)
        })

        test('should display phone number expanded', () => {
            const complainantPanel = complainantWitnessesSection.find('[data-test="complainantWitnessesPanel"]').first()
            const expectedPhoneNumber = '(123) 456-7890'
            containsText(complainantPanel, '[data-test="primaryComplainantPhoneNumber"]', expectedPhoneNumber)
        })

        test('should display email expanded', () => {
            const complainantPanel = complainantWitnessesSection.find('[data-test="complainantWitnessesPanel"]').first()

            containsText(complainantPanel, '[data-test="primaryComplainantEmail"]', primaryComplainant.email)
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
    })

    describe('behavioral tests', () => {
        test('should open edit complainant dialog when edit is clicked', () => {
            const editLink = complainantWitnesses.find('[data-test="editComplainantLink"]').first()
            editLink.simulate('click');
            expect(dispatchSpy).toHaveBeenCalledWith(openEditDialog())
        })
    })
});