import caseUpdateReducer from "./caseUpdateReducer";
import {updateNarrativeSuccess} from "../actionCreators";

describe('caseUpdateReducer', () => {
    test('should set default state', () => {
        const newState = caseUpdateReducer(undefined, {type: 'any action'})

        const expectedState = {
            success: false,
            message: ''
        }

        expect(newState).toEqual(expectedState)
    })

    describe('UPDATE_NARRATIVE_SUCCESS', () => {
        let newState
        beforeEach(() => {
            newState = caseUpdateReducer(undefined, updateNarrativeSuccess('some case'))
        })

        test('should set success to true', () => {
            expect(newState.success).toEqual(true)
        })

        test('should set success message', () => {
            expect(newState.message).toEqual('Your narrative was successfully updated')
        })
    });
});