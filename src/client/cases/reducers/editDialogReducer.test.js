import editDialogReducer from "./editDialogReducer";
import {openEditDialog} from "../actionCreators";

describe('editDialogReducer', () => {
    test('should set default state', () => {
        const newState = editDialogReducer(undefined, {type: 'any action'})

        expect(newState).toEqual({open: false})
    })

    test('should set open to true', () => {
        const newState = editDialogReducer(undefined, openEditDialog())

        expect(newState).toEqual({open: true})
    })
})