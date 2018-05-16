import userActionDialogReducer from "./userActionDialogReducer";
import {closeUserActionDialog, openUserActionDialog} from "../../actionCreators/casesActionCreators";

describe('userActionDialogReducer', () => {
    test('should set up initial state', () => {
        const newState = userActionDialogReducer(undefined, {type: 'some_action'})
        expect(newState).toEqual({open: false, dialogType: 'Add'})
    })

    test('should set open to true and set the dialog type on openDialog', () => {
        const oldState = {
            open: false,
            dialogType: 'none'
        }

        const dialogType = 'Edit'

        const actualState = userActionDialogReducer(oldState, openUserActionDialog(dialogType))

        const expectedState = {
            open: true,
            dialogType
        }

        expect(actualState).toEqual(expectedState)
    })

    test('should set open to false on closeDialog', () => {
       const newState = userActionDialogReducer({open: true}, closeUserActionDialog())

        expect(newState).toEqual({open: false})
    })
})