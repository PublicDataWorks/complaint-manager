import RemoveCivilianDialog from "./RemoveCivilianDialog";
import React from "react";
import {Provider} from "react-redux";
import {mount} from "enzyme";
import createConfiguredStore from "../../createConfiguredStore";
import {
    openRemoveCivilianDialog, closeRemoveCivilianDialog,
} from "../../actionCreators/casesActionCreators";
import formatName from "../../utilities/formatName";
import removeCivilian from "../thunks/removeCivilian";

jest.mock('../thunks/removeCivilian', () => () => ({
    type: "MOCK_THUNK"
}))

describe('removeCivilianDialog', () => {
    let dispatchSpy, wrapper, caseId, civilianDetails
    beforeEach(()=> {
        const store = createConfiguredStore()

        civilianDetails = {
            id: 123,
            caseId: 456,
            firstName: 'John',
            middleInitial: 'D',
            lastName: 'Doe',
            suffix: 'III'
        }

        store.dispatch(openRemoveCivilianDialog(civilianDetails))
        dispatchSpy = jest.spyOn(store, 'dispatch')

        wrapper = mount(
            <Provider store={store}>
                <RemoveCivilianDialog/>
            </Provider>
        )
    })

    test('should close dialog when cancel button is clicked', () => {
        const cancelButton = wrapper.find('[data-test="cancelButton"]').first()
        cancelButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(closeRemoveCivilianDialog())
    })

    test('should dispatch thunk when remove button is clicked', () => {
        const removeButton = wrapper.find('[data-test="removeButton"]').first()
        removeButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(removeCivilian(civilianDetails.id, civilianDetails.caseId))
    })

    test('should contain civilian full name', () => {
        const dialogText = wrapper.find('[data-test="warningText"]').first().text()
        expect(dialogText).toContain(formatName(civilianDetails))
    })
});