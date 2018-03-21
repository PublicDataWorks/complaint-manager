import React from 'react'
import {mount} from "enzyme";
import {Provider} from 'react-redux';
import createConfiguredStore from "../../../createConfiguredStore";
import EditCivilianDialog from "./EditCivilianDialog";
import {closeEditDialog, openEditDialog} from "../../../actionCreators/casesActionCreators";
import {
    changeInput,
    containsValue,
    expectEventuallyNotToExist,
    selectDropdownOption
} from "../../../../testHelpers";
import editCivilian from "../../thunks/editCivilian";
import {initialize} from "redux-form";
import Address from "../../../testUtilities/Address";
import Civilian from "../../../testUtilities/civilian";

jest.mock('../../thunks/editCivilian', () => (
    jest.fn(() => ({type: 'MOCK_EDIT_CIVILIAN_REQUESTED'}))
))


const suggestionEngine = {
    healthCheck: (callback) => {
        callback({googleAddressServiceIsAvailable : true})
    },

    getSuggestionValue: (suggestion) => {
        return suggestion.description
    },

    onFetchSuggestions: (input, callback) => {
        callback([{description: '200 East Randolph Street, Chicago, IL, US'}])
    },

    onSuggestionSelected: (suggestion, callback) => {
        callback({
            streetAddress: '200 E Randolph St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'US'
        })
    }
}

describe('Edit civilian dialog', () => {
    let editCivilianDialog, store, dispatchSpy, caseCivilian, save;
    beforeEach(() => {
        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        const addressToSubmit = new Address.Builder().defaultAddress()
            .withId(undefined)
            .withCivilianId(undefined)
            .withStreetAddress('200 E Randolph Street')
            .withStreetAddress2('FL 25')
            .withCity('Chicago')
            .withState('IL')
            .withZipCode('60601')
            .withCountry('US')
            .build()


        caseCivilian = new Civilian.Builder().defaultCivilian()
            .withFirstName('test first name')
            .withMiddleInitial('T')
            .withLastName('test last name')
            .withSuffix('test suffix')
            .withAddress(addressToSubmit)
            .withId(undefined)
            .withEmail(undefined)
            .withPhoneNumber(undefined)
            .withGenderIdentity(undefined)
            .withRaceEthnicity(undefined)
            .withBirthDate(undefined)
            .build()


        store.dispatch(initialize('EditCivilian', caseCivilian))

        editCivilianDialog = mount(
            <Provider store={store}>
                <EditCivilianDialog suggestionEngine={suggestionEngine}/>
            </Provider>)

        store.dispatch(openEditDialog())
        editCivilianDialog.update()
        save = editCivilianDialog.find('button[data-test="submitEditCivilian"]')
    })

    describe('address', () => {
        test('should disable address entry when google address suggestion service is not available', () => {
            const suggestionEngine = {
                healthCheck: async (callback) => {
                    callback({googleAddressServiceIsAvailable : false})
                },
                getSuggestionValue: (suggestion) => {},
                onFetchSuggestions: (input, callback) => {},
                onSuggestionSelected: (suggestion, callback) => {}
            }

            const otherStore = createConfiguredStore()
            const otherEditCivilianDialog = mount(
                <Provider store={otherStore}>
                    <EditCivilianDialog suggestionEngine={suggestionEngine}/>
                </Provider>)

            otherStore.dispatch(openEditDialog())
            otherEditCivilianDialog.update()

            containsValue(otherEditCivilianDialog, '[data-test="addressSuggestionField"] > input', 'Address lookup is down, please try again later')
        })
    });

    describe('gender', () => {
        let genderDropdown
        beforeEach(() => {
            genderDropdown = editCivilianDialog.find('[data-test="genderDropdown"]').last()
        });

        test('should show error if not set on save', () => {
            save.simulate('click')
            expect(genderDropdown.text()).toContain('Please enter Gender Identity')
        })
    })

    describe('race and ethnicity', () => {
        let raceDropdown
        beforeEach(() => {
            raceDropdown = editCivilianDialog.find('[data-test="raceDropdown"]').last()
        });

        test('should have a label race/ethnicity', () => {
            expect(raceDropdown.find('label').text()).toEqual('Race/Ethnicity *')
        })

        test('should show error if not set on save', () => {
            save.simulate('click')
            expect(raceDropdown.text()).toContain('Please enter Race/Ethnicity')
        })

    });

    describe('email and phone number', () => {
        test('should display phone and email errors when phone and email marked as touched on form submit', () => {
            save.simulate('click')

            const phoneNumberField = editCivilianDialog.find('div[data-test="phoneNumberField"]')
            const emailField = editCivilianDialog.find('div[data-test="emailField"]')

            expect(phoneNumberField.text()).toContain('Please enter phone number or email address')
            expect(emailField.text()).toContain('Please enter phone number or email address')
        })
    })


    describe('dialog dismissal', () => {
        test('should dismiss when cancel button is clicked', async () => {
            const cancel = editCivilianDialog.find('button[data-test="cancelEditCivilian"]')
            cancel.simulate('click')

            editCivilianDialog.update()

            expect(dispatchSpy).toHaveBeenCalledWith(closeEditDialog())
            await expectEventuallyNotToExist(editCivilianDialog, '[data-test="editDialogTitle"]')
        })
    })

    describe('on submit', () => {
        test('should submit form with address', () => {
            const civilianToSubmit = new Civilian.Builder().defaultCivilian()
                .withFirstName('Foo')
                .withLastName('Bar')
                .withMiddleInitial('Y')
                .withSuffix('updated test suffix')
                .withBirthDate('2012-02-13')
                .withGenderIdentity('Other')
                .withRaceEthnicity('Other')
                .withPhoneNumber('1234567890')
                .withEmail('example@test.com')
                .withAddress(caseCivilian.address)
                .withId(undefined)
                .build()


            changeInput(editCivilianDialog, '[data-test="firstNameInput"]', civilianToSubmit.firstName)
            changeInput(editCivilianDialog, '[data-test="middleInitialInput"]', civilianToSubmit.middleInitial)
            changeInput(editCivilianDialog, '[data-test="lastNameInput"]', civilianToSubmit.lastName)
            changeInput(editCivilianDialog, '[data-test="suffixInput"]', civilianToSubmit.suffix)
            changeInput(editCivilianDialog, '[data-test="birthDateInput"]', civilianToSubmit.birthDate)
            changeInput(editCivilianDialog, '[data-test="phoneNumberInput"]', civilianToSubmit.phoneNumber)
            changeInput(editCivilianDialog, '[data-test="emailInput"]', civilianToSubmit.email)
            selectDropdownOption(editCivilianDialog, '[data-test="genderDropdown"]', civilianToSubmit.genderIdentity)
            selectDropdownOption(editCivilianDialog, '[data-test="raceDropdown"]', civilianToSubmit.raceEthnicity)

            save.simulate('click')
            expect(editCivilian).toHaveBeenCalledWith(civilianToSubmit)
        })
    })
})
