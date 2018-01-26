import snackbarReducer from "./snackbarReducer";
import {
    createUserFailure, createUserSuccess,
    requestUserCreation
} from "../users/actionCreators";
import {createCaseFailure, createCaseSuccess, requestCaseCreation} from "../cases/actionCreators";
import {closeSnackbar, openSnackbar} from "./actionCreators";

describe('snackbarReducer', () => {
    test('should default to false', () => {
        const state = snackbarReducer(undefined, {type: "SOME_ACTION"})
        expect(state).toEqual(false)
    })

    describe('OPEN_SNACKBAR', () => {
        test('should return true', () => {
            const state = snackbarReducer(undefined, openSnackbar())
            expect(state).toEqual(true)
        })

        test('should not mutate state', () => {
            const initialState = false
            const newState = snackbarReducer(initialState, openSnackbar())

            expect(newState).not.toEqual(initialState)
        })
    });

    describe('CLOSE_SNACKBAR', () => {
        test('should return false', () => {
            const initialState = true

            const state = snackbarReducer(initialState, closeSnackbar())

            expect(state).toBe(false)
        })

        test('should not mutate state', () => {
            const initialState = true
            const newState = snackbarReducer(initialState, closeSnackbar())

            expect(newState).not.toEqual(initialState)
        })
    })

    describe('USER_CREATION', () => {
        test('USER_CREATION_REQUESTED', () => {
            const initialState = true
            const newState = snackbarReducer(initialState, requestUserCreation())

            expect(newState).toBe(false)
        })

        test('USER_CREATED_SUCCESS', () => {
            const initialState = false
            const newState = snackbarReducer(initialState, createUserSuccess())

            expect(newState).toBe(true)
        })

        test('USER_CREATION_FAILED', () => {
            const initialState = false
            const newState = snackbarReducer(initialState, createUserFailure())

            expect(newState).toBe(true)
        })
    })

    describe('CASE_CREATION', () => {
        test('CASE_CREATION_REQUESTED', () => {
            const initialState = true
            const newState = snackbarReducer(initialState, requestCaseCreation())

            expect(newState).toBe(false)
        })

        test('CASE_CREATED_SUCCESS', () => {
            const initialState = false
            const newState = snackbarReducer(initialState, createCaseSuccess())

            expect(newState).toBe(true)
        })

        test('CASE_CREATION_FAILED', () => {
            const initialState = false
            const newState = snackbarReducer(initialState, createCaseFailure())

            expect(newState).toBe(true)
        })
    })

})