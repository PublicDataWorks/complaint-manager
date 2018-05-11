import React from 'react'
import Civilian from "../../testUtilities/civilian";
import {mount} from "enzyme";
import DisplayComplainant from "./DisplayComplainant";
import CaseOfficer from "../../testUtilities/caseOfficer";
import Officer from "../../testUtilities/Officer";

test('displays the complainant when complainant is civilian', () => {
    const firstName = "Sal";
    const lastName = "Ariza";

    const civilian = new Civilian.Builder()
        .withFirstName(firstName).withLastName(lastName).withRoleOnCase("Complainant").build()
    const witness = new Civilian.Builder()
        .withFirstName(firstName).withLastName(lastName).withRoleOnCase("Witness").build()

    const wrapper = mount(<DisplayComplainant caseDetails={{ civilians: [ civilian, witness] }}/>)

    expect(wrapper.text()).toEqual(firstName + " " + lastName)
})

test('displays complainant if the complainant is an officer', () => {
    const officerFullName = "TEST_OFFICER_COMPLAINANT_NAME";
    const expectedDisplayName = "Officer " + officerFullName;

    const complainantOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer().withRoleOnCase("Complainant").withOfficer(
            new Officer.Builder().defaultOfficer().withFullName(officerFullName).build()).build()

    const wrapper = mount(<DisplayComplainant caseDetails={{ civilians: [], complainantWitnessOfficers: [complainantOfficer] }} />)

    expect(wrapper.text()).toEqual(expectedDisplayName)
})

test('displays an civilian complainant by default if civilian and officer complainants exist', () => {
    const complainantFirstName = "TEST_FIRST_NAME"
    const complainantLastName = "TEST_LAST_NAME"
    const officerFullName = "TEST_OFFICER_COMPLAINANT_NAME";

    const complainantOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer().withRoleOnCase("Complainant").withOfficer(
            new Officer.Builder().defaultOfficer().withFullName(officerFullName).build()).build()

    const complainantCivilian = new Civilian.Builder()
        .withFirstName(complainantFirstName).withLastName(complainantLastName).withRoleOnCase("Complainant").build()

    const wrapper = mount(<DisplayComplainant caseDetails={{ civilians: [complainantCivilian], complainantWitnessOfficers: [complainantOfficer] }} />)

    expect(wrapper.text()).toEqual(complainantFirstName + " " + complainantLastName)
})

test('displays no complainant when non-complainants exists', () => {
    const firstName = "Sal";
    const lastName = "Ariza";

    const witness = new Civilian.Builder()
        .withFirstName(firstName).withLastName(lastName).withRoleOnCase("Witness").build()

    const witnessOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer().withOfficer(new Officer.Builder().defaultOfficer())

    const wrapper = mount(<DisplayComplainant caseDetails={{ civilians: [ witness ], complainantWitnessOfficers: [witnessOfficer] }} />)

    expect(wrapper.find("[data-test='warnIcon']").exists()).toBeTruthy()
    expect(wrapper.text()).toEqual("No Complainants")
})

test('displays no complainant when there no civilians exist', () => {
    const wrapper = mount(<DisplayComplainant caseDetails={{ civilians: [] }} />)

    expect(wrapper.find("[data-test='warnIcon']").exists()).toBeTruthy()
    expect(wrapper.text()).toEqual("No Complainants")
})