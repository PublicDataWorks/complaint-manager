import React from 'react'
import {mount} from "enzyme";
import {Provider} from 'react-redux';
import createConfiguredStore from "../../../createConfiguredStore";
import EditCivilianDialog from "./EditCivilianDialog";
import {openEditDialog} from "../../actionCreators";
import {containsText} from "../../../../testHelpers";
import {expectEventuallyNotToExist} from "../../../../testHelpers";
import {closeEditDialog} from "../../actionCreators";

describe('Edit civilian dialog', () => {
    let editCivilianDialog, store, dispatchSpy;
    beforeEach(() => {
        store = createConfiguredStore()
        dispatchSpy = jest.spyOn(store, 'dispatch')

        editCivilianDialog = mount(
            <Provider store={store}>
                <EditCivilianDialog></EditCivilianDialog>
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
})