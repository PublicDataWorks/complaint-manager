import React from 'react'
import { genderIdentityMenu, generateMenu, raceEthnicityMenu } from "./generateMenus";
import { mount } from "enzyme";
import { Select } from "material-ui";

const getMenuOptions = (mountedComponent) => {
    return mountedComponent
        .find('li[role="option"]')
        .map(node => node.text())
}

describe('civilian info dropdown menus', () => {
    test('gender identity menu should contain all required values', () => {
        const genderIdentityMenuComponent = mount(
                <Select open={true} value="">
                    {
                        genderIdentityMenu
                    }
                </Select>
            )

        const options = getMenuOptions(genderIdentityMenuComponent)

        expect(options).toMatchSnapshot()
    })

    test('race ethnicity menu should contain all required values', () => {
        const raceEthnicityMenuComponent = mount(
            <Select open={true} value="">
                {
                    raceEthnicityMenu
                }
            </Select>
        )

        const options = getMenuOptions(raceEthnicityMenuComponent)

        expect(options).toMatchSnapshot()
    })

    test('should allow optional values for menu items', () => {
        const districts = [
            ['Any district', ''],
            '1st district'
        ]
        const districtsMenuComponent = mount(
            <Select value="">
                {
                    generateMenu(districts)
                }
            </Select>
        )

        districtsMenuComponent.find('[role="button"]').simulate('click')

        const options = districtsMenuComponent
            .find('li[role="option"]');

        const anyDistrictOption = options.first();
        expect(anyDistrictOption.text()).toEqual("Any district");
        expect(anyDistrictOption.props()["data-value"]).toEqual("");

        const firstDistrictOption = options.last();
        expect(firstDistrictOption.text()).toEqual("1st district");
        expect(firstDistrictOption.props()["data-value"]).toEqual("1st district");
    })
});