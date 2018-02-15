import React from 'react'
import {mount} from "enzyme";
import {Provider} from 'react-redux';
import createConfiguredStore from "../../../createConfiguredStore";
import EditCivilianDialog from "./EditCivilianDialog";
import {closeEditDialog, openEditDialog} from "../../actionCreators";
import {containsText, expectEventuallyNotToExist} from "../../../../testHelpers";
import moment from "moment";

describe('Edit civilian dialog', () => {
    let editCivilianDialog, store, dispatchSpy, currentCaseCivilian;
    beforeEach(() => {
        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        currentCaseCivilian = {
            firstName: 'test first name',
            lastName: 'test last name'
        }
        editCivilianDialog = mount(
            <Provider store={store}>
                <EditCivilianDialog civilian={currentCaseCivilian}></EditCivilianDialog>
            </Provider>)

        store.dispatch(openEditDialog())
        editCivilianDialog.update()
    })

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

        test('should pre-populate last name for existing case', () => {
            const lastName = editCivilianDialog.find('[data-test="lastNameField"]').first().instance().value

            expect(lastName).not.toEqual(undefined)
            expect(lastName).toEqual(currentCaseCivilian.lastName)
        })

    })

    describe('Birthdate', () => {
        test('should default date to mm/dd/yyyy', () => {
            const datePicker = editCivilianDialog.find('[data-test="birthDateInput"]').last()
            expect(datePicker.instance().value).toEqual("YYYY-MM-DD")
        })

        test('should not change when changing to a future date', () => {
            const datePicker = editCivilianDialog.find('[data-test="birthDateInput"]').last()
            const tomorrow = moment(Date.now()).add(2, 'days').format("YYYY-MM-DD")
            datePicker.simulate('change', {target: {value: tomorrow.toString()}})

            const datePickerField = editCivilianDialog.find('[data-test="birthDateField"]').first()
            datePickerField.simulate('blur')

            expect(datePickerField.text()).toContain('Date cannot be in the future')
        })

        test('should change when changing to a past date', () => {
            const datePicker = editCivilianDialog.find('[data-test="birthDateInput"]').last()
            const yesterday = moment(Date.now()).subtract(1, 'days').format("YYYY-MM-DD")
            datePicker.simulate('change', {target: {value: yesterday}})

            expect(datePicker.instance().value).toEqual(yesterday)
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

    describe('form save', () => {
        test('should have a submit button', () => {
            const save = editCivilianDialog.find('button[data-test="submitEditCivilian"]')

            expect(save.text()).toEqual('Save')
        })
    })
})

