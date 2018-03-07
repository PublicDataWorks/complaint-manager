import editDialogReducer from "./editDialogReducer";
import {closeEditDialog, openEditDialog} from "../../actionCreators/casesActionCreators";

describe('editDialogReducer', () => {
    test('should set default state', () => {
        const newState = editDialogReducer(undefined, {type: 'any action'})

        expect(newState).toEqual({open: false})
    })

    test('should set open to true', () => {
        const newState = editDialogReducer(undefined, openEditDialog())

        expect(newState).toEqual({open: true})
    })

    test('should set open to false', () => {
        const newState = editDialogReducer({open: true}, closeEditDialog())

        expect(newState).toEqual({open: false})
    })
})