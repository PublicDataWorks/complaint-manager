import caseSnackbarReducer from "./caseSnackbarReducer";
import {closeCaseSnackbar, openCaseSnackbar} from "../actionCreators";
import {createCaseFailure, createCaseSuccess, requestCaseCreation} from "../actionCreators";

describe('caseSnackbarReducer', () => {
    test('should default to false', () => {
        const state = caseSnackbarReducer(undefined, {type: "SOME_ACTION"})
        expect(state).toEqual(false)
    })

    describe('OPEN_SNACKBAR', () => {
        test('should return true', () => {
            const state = caseSnackbarReducer(undefined, openCaseSnackbar())
            expect(state).toEqual(true)
        })

        test('should not mutate state', () => {
            const initialState = false
            const newState = caseSnackbarReducer(initialState, openCaseSnackbar())

            expect(newState).not.toEqual(initialState)
        })
    });

    describe('CLOSE_SNACKBAR', () => {
        test('should return false', () => {
            const initialState = true

            const state = caseSnackbarReducer(initialState, closeCaseSnackbar())

            expect(state).toBe(false)
        })

        test('should not mutate state', () => {
            const initialState = true
            const newState = caseSnackbarReducer(initialState, closeCaseSnackbar())

            expect(newState).not.toEqual(initialState)
        })
    })

    describe('CASE_CREATION', () => {
        test('CASE_CREATION_REQUESTED', () => {
            const initialState = true
            const newState = caseSnackbarReducer(initialState, requestCaseCreation())

            expect(newState).toBe(false)
        })

        test('CASE_CREATED_SUCCESS', () => {
            const initialState = false
            const newState = caseSnackbarReducer(initialState, createCaseSuccess())

            expect(newState).toBe(true)
        })

        test('CASE_CREATION_FAILED', () => {
            const initialState = false
            const newState = caseSnackbarReducer(initialState, createCaseFailure())

            expect(newState).toBe(true)
        })
    })
})