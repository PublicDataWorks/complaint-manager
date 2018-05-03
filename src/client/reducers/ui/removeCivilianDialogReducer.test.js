import removeCivilianDialogReducer from "./removeCivilianDialogReducer";
import {openRemoveCivilianDialog, closeRemoveCivilianDialog} from "../../actionCreators/casesActionCreators";

describe('removeCivilianDialogReducer', () => {
    test('should set default state', () => {
        const newState = removeCivilianDialogReducer(undefined, {type: 'some action'})
        expect(newState).toEqual({open: false, civilianDetails: {}})
    })

    test('should set open to true on REMOVE_CIVILIAN_DIALOG_OPENED', () => {
        const oldState = {
            open:false,
            civilianDetails: {}
        }
        const civilianDetails = {details: "some details"}

        const actualState = removeCivilianDialogReducer(oldState, openRemoveCivilianDialog(civilianDetails))

        const expectedState = {
            open: true,
            civilianDetails
        }

        expect(actualState).toEqual(expectedState)
    })

    test('should set open to false on REMOVE_CIVILIAN_DIALOG_CLOSED', () => {
        const oldState = {
            open:true,
            civilianDetails: {some: "details"}
        }

        const actualState = removeCivilianDialogReducer(oldState, closeRemoveCivilianDialog())

        const expectedState = {
            open: false,
            civilianDetails: {}
        }

        expect(actualState).toEqual(expectedState)
    })
});