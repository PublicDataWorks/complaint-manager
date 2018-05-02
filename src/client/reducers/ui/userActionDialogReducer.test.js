import userActionDialogReducer from "./userActionDialogReducer";
import {closeUserActionDialog, openUserActionDialog} from "../../actionCreators/casesActionCreators";

describe('userActionDialogReducer', () => {
    test('should set up initial state', () => {
        const newState = userActionDialogReducer(undefined, {type: 'some_action'})
        expect(newState).toEqual({open: false})
    })

    test('should set open to true on openDialog', () => {
        const oldState = {
            open: false
        }

        const expectedState = {
            open: true
        }

        const actualState = userActionDialogReducer(oldState, openUserActionDialog())
        expect(actualState).toEqual(expectedState)
    })

    test('should set open to false on closeDialog', () => {
       const newState = userActionDialogReducer({open: true}, closeUserActionDialog())

        expect(newState).toEqual({open: false})
    })
})