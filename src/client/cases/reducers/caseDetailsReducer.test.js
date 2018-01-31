import caseDetailsReducer from "./caseDetailsReducer";
import {createCaseSuccess, updateNarrativeFailure, updateNarrativeSuccess} from "../actionCreators";

describe('caseDetailsReducer', () => {
    test('should set default state', () => {
        const newState = caseDetailsReducer(undefined, {type: 'any action'})

        const expectedState = {
            success: false,
            message: ''
        }

        expect(newState).toEqual(expectedState)
    })

    describe('CASE_CREATED_SUCCESS', () => {
        let newState, id
        beforeEach(() => {
            id = 1;
            newState = caseDetailsReducer(undefined, createCaseSuccess({id: id}))
        })

        test('should set success to true', () => {
           expect(newState.success).toEqual(true)
        })

        test('should set success message', () => {
           expect(newState.message).toEqual(`Case ${id} was successfully created.`)
        })
    });

    describe('NARRATIVE_UPDATE_SUCCEEDED', () => {
        let newState
        beforeEach(() => {
            newState = caseDetailsReducer(undefined, updateNarrativeSuccess('some case'))
        })

        test('should set success to true', () => {
            expect(newState.success).toEqual(true)
        })

        test('should set success message', () => {
            expect(newState.message).toEqual('Your narrative was successfully updated')
        })
    });

    describe('NARRATIVE_UPDATE_FAILED', () => {
        let newState
        beforeEach(() => {
            newState = caseDetailsReducer({success: true, message: 'some message'}, updateNarrativeFailure())
        })

        test('should set success to false', () => {
            expect(newState.success).toEqual(false)
        })

        test('should set failure message', () => {
            expect(newState.message).toEqual('Something went wrong on our end and your case was not updated. Please try again.')
        })
    });
});