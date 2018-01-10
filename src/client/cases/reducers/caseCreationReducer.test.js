import caseCreationReducer from './caseCreationReducer'
import { createCaseFailure, createCaseSuccess, requestCaseCreation } from '../actionCreators'

describe('caseCreationReducer', () => {
    test('should set default values', () => {
        const newState = caseCreationReducer(undefined, { type: 'ABC' })
        const expectedState = {
            inProgress: false,
            success: false,
            message: ''
        }

        expect(newState).toEqual(expectedState)
    })

    describe('CASE_CREATION_REQUESTED', () => {
        test('should be in progress', () => {
            const newState = caseCreationReducer(undefined, requestCaseCreation())

            expect(newState.inProgress).toBeTruthy()
        })

        test('should not be successful', () => {
            const newState = caseCreationReducer(undefined, requestCaseCreation())

            expect(newState.success).toEqual(false)
        })

        test('should have empty message', () => {
            const newState = caseCreationReducer(undefined, requestCaseCreation())

            expect(newState.message).toEqual('')
        })
    })

    describe('CASE_CREATED_SUCCESS', () => {
        let newState

        beforeEach(() => {
            newState = caseCreationReducer(undefined, createCaseSuccess({ id: 1234 }))
        })

        test('should not be in progress', () => {
            expect(newState.inProgress).toEqual(false)
        })

        test('should be successful', () => {
            expect(newState.success).toEqual(true)
        })

        test('should have success message', () => {
            expect(newState.message).toEqual('Case 1234 was successfully created.')
        })
    })

    describe('CASE_CREATION_FAILED', () => {
        let newState

        beforeEach(() => {
            newState = caseCreationReducer(undefined, createCaseFailure({ error: 500 }))
        })

        test('should not be in progress', () => {
            expect(newState.inProgress).toEqual(false)
        })

        test('should not be successful', () => {
            expect(newState.success).toEqual(false)
        })

        test('should have success message', () => {
            expect(newState.message).toEqual(
            'Something went wrong on our end and your case was not created. Please try again.')
        })
    })

    describe('other actions', () => {
        test('should return old state', () => {
            const oldState = { abc: 'some value' }

            const newState = caseCreationReducer(oldState, { type: 'OTHER' })

            expect(newState).toEqual(oldState)
        })
    })
})
