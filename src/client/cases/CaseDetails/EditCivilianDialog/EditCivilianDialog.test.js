import React from 'react'
import {mount} from "enzyme";
import {Provider} from 'react-redux';
import createConfiguredStore from "../../../createConfiguredStore";
import EditCivilianDialog from "./EditCivilianDialog";
import {openEditDialog} from "../../actionCreators";
import {containsText} from "../../../../testHelpers";

describe('Edit civilian dialog', () => {
    let editCivilianDialog, store;
    beforeEach(() => {
        store = createConfiguredStore()

        editCivilianDialog = mount(
            <Provider store={store}>
                <EditCivilianDialog></EditCivilianDialog>
            </Provider>)
    })

    test('should display title if state is open', () => {
        store.dispatch(openEditDialog())
        editCivilianDialog.update()

        containsText(editCivilianDialog, '[data-test="editDialogTitle"]', 'Edit Civilian')
    })

    describe('fields', () => {
        beforeEach(() => {
            store.dispatch(openEditDialog())
            editCivilianDialog.update()
        })

        test('has radio group for role on case', () => {
            containsText(editCivilianDialog, '[data-test="roleOnCaseRadioGroup"]', 'Primary Complainant')
        })
    })
})