import React from 'react'
import {mount} from "enzyme";
import {Provider} from 'react-redux';
import createConfiguredStore from "../../../createConfiguredStore";
import EditCivilianDialog from "./EditCivilianDialog";
import {closeEditDialog, openEditDialog} from "../../actionCreators";
import {
    changeInput,
    containsText,
    containsValue,
    expectEventuallyNotToExist,
    selectDropdownOption
} from "../../../../testHelpers";
import editCivilian from "../../thunks/editCivilian";
import {initialize} from "redux-form";

jest.mock('../../thunks/editCivilian', () => (
    jest.fn(() => ({type: 'MOCK_EDIT_CIVILIAN_REQUESTED'}))
))


describe('Edit civilian dialog', () => {
    let editCivilianDialog, store, dispatchSpy, currentCaseCivilian, save;
    beforeEach(() => {
        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        currentCaseCivilian = {
            firstName: 'test first name',
            middleInitial: 'T',
            lastName: 'test last name',
            suffix: 'test suffix'
        }

        store.dispatch(initialize('EditCivilian', currentCaseCivilian))

        editCivilianDialog = mount(
            <Provider store={store}>
                <EditCivilianDialog/>
            </Provider>)

        store.dispatch(openEditDialog())
        editCivilianDialog.update()
        save = editCivilianDialog.find('button[data-test="submitEditCivilian"]')
    })

    const getMenuOptions = (mountedComponent, menuSelector) => {
         return mountedComponent
            .find(menuSelector)
            .find('li[role="option"]')
            .map(node => node.text())

    }

    test('should display title if state is open', () => {
        containsText(editCivilianDialog, '[data-test="editDialogTitle"]', 'Edit Civilian')
    })

    describe('fields', () => {
        test('has radio group for role on case', () => {
            containsText(editCivilianDialog, '[data-test="roleOnCaseRadioGroup"]', 'Primary Complainant')
        })
        test('should pre-populate first name for existing case', () => {
            const firstName = editCivilianDialog.find('[data-test="firstNameField"]').first().instance().value
            expect(firstName).toEqual(currentCaseCivilian.firstName)
        })

        test('should pre-populate middle initial', () => {
            containsValue(editCivilianDialog, '[data-test="middleInitialInput"]', currentCaseCivilian.middleInitial)
        })

        test('should pre-populate suffix', () => {
            containsValue(editCivilianDialog, '[data-test="suffixInput"]', currentCaseCivilian.suffix)
        })

        test('should pre-populate last name for existing case', () => {
            const lastName = editCivilianDialog.find('[data-test="lastNameField"]').first().instance().value
            expect(lastName).toEqual(currentCaseCivilian.lastName)
        })
    })

    describe('birthdate', () => {

        let datePicker, datePickerField
        beforeEach(() => {
            datePicker = editCivilianDialog.find('[data-test="birthDateInput"]').last()
            datePickerField = editCivilianDialog.find('[data-test="birthDateField"]').first()
        });

        test('should pre-populate birthdate for existing birthdate', () => {
            store.dispatch(initialize('EditCivilian', {...currentCaseCivilian, birthDate: '2018-02-14'}))
            const birthDate = editCivilianDialog.find('[data-test="birthDateField"]').first().instance().value
            expect(birthDate).toEqual('2018-02-14')
        })

        test('should default date to mm/dd/yyyy', () => {
            expect(datePicker.instance().value).toEqual("")
        })
    });

    describe('gender', () => {
        let genderDropdown
        beforeEach(() => {
            genderDropdown = editCivilianDialog.find('[data-test="genderDropdown"]').last()
        });

        test('should have a label gender identity', () => {
            expect(genderDropdown.find('label').text()).toEqual('Gender Identity *')
        })

        test('should have all gender options', () => {
            genderDropdown = editCivilianDialog
                .find('[name="genderIdentity"]')
                .find('[role="button"]')
                .first()

            genderDropdown.simulate('click')

            const genders = [
                'Female',
                'Male',
                'Trans Female',
                'Trans Male',
                'Other',
                'Unknown'
            ]

            const menuOptions = getMenuOptions(editCivilianDialog, '[id="menu-genderIdentity"]')
            expect(genders).toEqual(menuOptions)
        })

        test('should change if already set', async () => {
            genderDropdown = editCivilianDialog
                .find('[name="genderIdentity"]')
                .find('[role="button"]')
                .first()

            selectDropdownOption(editCivilianDialog, '[name="genderIdentity"]', 'Female')

            expect(genderDropdown.text()).toEqual('Female')
        })

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

        test('should have all race/ethnicity options', () => {

            raceDropdown = editCivilianDialog
                .find('[name="raceEthnicity"]')
                .find('[role="button"]')
                .first()

            raceDropdown.simulate('click')

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

            const menuOptions = getMenuOptions(editCivilianDialog, '[id="menu-raceEthnicity"]')
            expect(races).toEqual(menuOptions)

        })

        test('should change if already set', () => {
            raceDropdown = editCivilianDialog
                .find('[name="raceEthnicity"]')
                .find('[role="button"]')
                .first()

            selectDropdownOption(editCivilianDialog, '[name="raceEthnicity"]', 'Korean')

            expect(raceDropdown.text()).toEqual('Korean')
        })

        test('should show error if not set on save', () => {
            save.simulate('click')
            expect(raceDropdown.text()).toContain('Please enter Race/Ethnicity')
        })

    });

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
        let submittedValues

        beforeEach(() => {
            submittedValues = {
                firstName: 'Foo',
                lastName: 'Bar',
                middleInitial: 'Y',
                suffix: 'updated test suffix',
                birthDate: '2012-02-13',
                genderIdentity: 'Other',
                raceEthnicity: 'Other'
            }

            changeInput(editCivilianDialog, '[data-test="firstNameInput"]', submittedValues.firstName)
            changeInput(editCivilianDialog, '[data-test="middleInitialInput"]', submittedValues.middleInitial)
            changeInput(editCivilianDialog, '[data-test="lastNameInput"]', submittedValues.lastName)
            changeInput(editCivilianDialog, '[data-test="suffixInput"]', submittedValues.suffix)
            changeInput(editCivilianDialog, '[data-test="birthDateInput"]', submittedValues.birthDate)

            selectDropdownOption(editCivilianDialog, '[data-test="genderDropdown"]', submittedValues.genderIdentity)
            selectDropdownOption(editCivilianDialog, '[data-test="raceDropdown"]', submittedValues.raceEthnicity)
        });

        test('should fill in form and call thunk', () => {
            containsValue(editCivilianDialog, '[data-test="firstNameInput"]', submittedValues.firstName)
            containsValue(editCivilianDialog, '[data-test="lastNameInput"]', submittedValues.lastName)
            containsValue(editCivilianDialog, '[data-test="birthDateInput"]', submittedValues.birthDate)
            containsValue(editCivilianDialog, '[data-test="suffixInput"]', submittedValues.suffix)
            containsValue(editCivilianDialog, '[data-test="birthDateInput"]', submittedValues.birthDate)
            containsText(editCivilianDialog, '[data-test="genderDropdown"]', submittedValues.genderIdentity)
            containsText(editCivilianDialog, '[data-test="raceDropdown"]', submittedValues.raceEthnicity)

            save.simulate('click')
            expect(editCivilian).toHaveBeenCalledWith(submittedValues)
        })
    })
})

