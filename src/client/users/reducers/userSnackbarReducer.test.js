import userSnackbarReducer from "./userSnackbarReducer";
import {
    closeUserSnackbar, createUserFailure, createUserSuccess, openUserSnackbar,
    requestUserCreation
} from "../actionCreators";

describe('userSnackbarReducer', () => {
    test('should default to false', () => {
        const state = userSnackbarReducer(undefined, {type: "SOME_ACTION"})
        expect(state).toEqual(false)
    })

    describe('OPEN_SNACKBAR', () => {
        test('should return true', () => {
            const state = userSnackbarReducer(undefined, openUserSnackbar())
            expect(state).toEqual(true)
        })

        test('should not mutate state', () => {
            const initialState = false
            const newState = userSnackbarReducer(initialState, openUserSnackbar())

            expect(newState).not.toEqual(initialState)
        })
    });

    describe('CLOSE_SNACKBAR', () => {
        test('should return false', () => {
            const initialState = true

            const state = userSnackbarReducer(initialState, closeUserSnackbar())

            expect(state).toBe(false)
        })

        test('should not mutate state', () => {
            const initialState = true
            const newState = userSnackbarReducer(initialState, closeUserSnackbar())

            expect(newState).not.toEqual(initialState)
        })
    })

    describe('USER_CREATION', () => {
        test('USER_CREATION_REQUESTED', () => {
            const initialState = true
            const newState = userSnackbarReducer(initialState, requestUserCreation())

            expect(newState).toBe(false)
        })

        test('USER_CREATED_SUCCESS', () => {
            const initialState = false
            const newState = userSnackbarReducer(initialState, createUserSuccess())

            expect(newState).toBe(true)
        })

        test('USER_CREATION_FAILED', () => {
            const initialState = false
            const newState = userSnackbarReducer(initialState, createUserFailure())

            expect(newState).toBe(true)
        })
    })

})