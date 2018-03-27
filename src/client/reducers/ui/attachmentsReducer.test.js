import attachmentsReducer from "./attachmentsReducer";
import {dropDuplicateFile, removeDropzoneFile} from "../../actionCreators/attachmentsActionCreators";

describe('attachmentReducer', () => {
    test('should set the default state', () => {
        const defaultState = attachmentsReducer(undefined, {type: 'blah'})

        expect(defaultState).toEqual({errorMessage: ''})
    })

    test('should clear error message when file removed', () => {
        const startingState = {errorMessage: 'File type not supported.'}
        const newState = attachmentsReducer(startingState, removeDropzoneFile())

        expect(newState).toEqual({errorMessage: ''})
    })

    test('should set error message for duplicate file type', () => {
        const startingState = {errorMessage: ''}
        const newState = attachmentsReducer(startingState, dropDuplicateFile())

        expect(newState).toEqual({errorMessage: 'File name already exists'})
    })
})