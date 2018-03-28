import React from 'react'
import {genderIdentityMenu, raceEthnicityMenu} from "./generateMenus";
import {mount} from "enzyme";
import {Select} from "material-ui";

const getMenuOptions = (mountedComponent) => {
    return mountedComponent
        .find('li[role="option"]')
        .map(node => node.text())

}

describe('civilian info dropdown menus', () => {
    test('gender identity menu should contain all required values', () => {
        const genders = [
            'Female',
            'Male',
            'Trans Female',
            'Trans Male',
            'Other',
            'Unknown'
        ]

        const genderIdentityMenuComponent = mount(
            <Select
                value=""
            >
                {
                    genderIdentityMenu
                }
            </Select>
        )

        genderIdentityMenuComponent.find('[role="button"]').simulate('click')

        const menuOptions = getMenuOptions(genderIdentityMenuComponent)
        expect(genders).toEqual(menuOptions)
    })

    test('race ethnicity menu should contain all required values', () => {
        const races = [
            'American Indian or Alaska Native',
            'Asian Indian',
            'Black, African American',
            'Chinese',
            'Cuban',
            'Filipino',
            'Guamanian or Chamorro',
            'Hispanic, Latino, or Spanish origin',
            'Japanese',
            'Korean',
            'Mexican, Mexican American, Chicano',
            'Native Hawaiian',
            'Puerto Rican',
            'Vietnamese',
            'Samoan',
            'White',
            'Other Pacific Islander',
            'Other Asian',
            'Other',
            'Unknown'
        ]

        const raceEthnicityMenuComponent = mount(
            <Select
                value=""
            >
                {
                    raceEthnicityMenu
                }
            </Select>
        )

        raceEthnicityMenuComponent.find('[role="button"]').simulate('click')

        const menuOptions = getMenuOptions(raceEthnicityMenuComponent)
        expect(races).toEqual(menuOptions)
    })
});