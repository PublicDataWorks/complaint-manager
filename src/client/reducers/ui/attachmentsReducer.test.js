import attachmentsReducer from "./attachmentsReducer";
import { dropInvalidFileType, removeDropzoneFile } from "../../actionCreators/attachmentsActionCreators";

describe('attachmentReducer', () => {
    test('should set the default state', () => {
        const defaultState = attachmentsReducer(undefined, {type: 'blah'})

        expect(defaultState).toEqual({ invalidFileMessageVisible: false })
    })

    test('should set invalid file type message to be visible on invalid file type', () => {
        const startingState = { invalidFileMessageVisible: false}
        const newState = attachmentsReducer(startingState, dropInvalidFileType())

        expect(newState).toEqual({ invalidFileMessageVisible: true })
    })

    test('should set invalid file type to not visible', () => {
        const startingState = { invalidFileMessageVisible: true }

        const newState = attachmentsReducer(startingState, removeDropzoneFile())

        expect(newState).toEqual({ invalidFileMessageVisible: false })
    })
})