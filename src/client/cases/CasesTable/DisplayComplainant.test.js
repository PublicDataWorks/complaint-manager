import React from 'react'
import Civilian from "../../testUtilities/civilian";
import {mount} from "enzyme";
import DisplayComplainant from "./DisplayComplainant";

test('displays the complainant', () => {
    const firstName = "Sal";
    const lastName = "Ariza";

    const civilian = new Civilian.Builder()
        .withFirstName(firstName).withLastName(lastName).withRoleOnCase("Complainant").build()
    const witness = new Civilian.Builder()
        .withFirstName(firstName).withLastName(lastName).withRoleOnCase("Witness").build()

    const wrapper = mount(<DisplayComplainant civilians={ [civilian, witness] }/>)

    expect(wrapper.text()).toEqual(firstName + " " + lastName)
})

test('displays no complainant when non-complainant exists', () => {
    const firstName = "Sal";
    const lastName = "Ariza";

    const witness = new Civilian.Builder()
        .withFirstName(firstName).withLastName(lastName).withRoleOnCase("Witness").build()

    const wrapper = mount(<DisplayComplainant civilians={ [witness] }/>)

    expect(wrapper.find("[data-test='warnIcon']").exists()).toBeTruthy()
    expect(wrapper.text()).toEqual("No Complainants")
})

test('displays no complainant when there no civilians exist', () => {
    const wrapper = mount(<DisplayComplainant civilians={ [] }/>)

    console.log(wrapper.debug())

    expect(wrapper.find("[data-test='warnIcon']").exists()).toBeTruthy()
    expect(wrapper.text()).toEqual("No Complainants")
})