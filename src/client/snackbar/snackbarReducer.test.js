import snackbarReducer from "./snackbarReducer";
import {
    createUserFailure, createUserSuccess,
    requestUserCreation
} from "../users/actionCreators";
import {createCaseFailure, createCaseSuccess, requestCaseCreation} from "../cases/actionCreators";
import {closeSnackbar, openSnackbar} from "./actionCreators";

describe('snackbarReducer', () => {
    test('should default open to false', () => {
        const state = snackbarReducer(undefined, {type: "SOME_ACTION"})
        expect(state.open).toEqual(false)
    })

    describe('OPEN_SNACKBAR', () => {
        test('should set open to true', () => {
            const state = snackbarReducer(undefined, openSnackbar())
            expect(state.open).toEqual(true)
        })

        test('should not mutate state', () => {
            const initialState = {open:false}
            const newState = snackbarReducer(initialState, openSnackbar())

            expect(newState.open).not.toEqual(initialState)
        })
    });

    describe('CLOSE_SNACKBAR', () => {
        test('should set open to false', () => {
            const initialState = {open:true}

            const state = snackbarReducer(initialState, closeSnackbar())

            expect(state.open).toBe(false)
        })

        test('should not mutate state', () => {
            const initialState = {open:true}
            const newState = snackbarReducer(initialState, closeSnackbar())

            expect(newState.open).not.toEqual(initialState)
        })
    })

    describe('USER_CREATION', () => {
        test('USER_CREATION_REQUESTED', () => {
            const initialState = {open: true}
            const newState = snackbarReducer(initialState, requestUserCreation())

            expect(newState.open).toBe(false)
        })

        test('USER_CREATED_SUCCESS', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, createUserSuccess())

            expect(newState.open).toBe(true)
        })

        test('USER_CREATION_FAILED', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, createUserFailure())

            expect(newState.open).toBe(true)
        })
    })

    describe('CASE_CREATION', () => {
        test('CASE_CREATION_REQUESTED', () => {
            const initialState = {open: true}
            const newState = snackbarReducer(initialState, requestCaseCreation())

            expect(newState.open).toBe(false)
        })

        test('CASE_CREATED_SUCCESS', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, createCaseSuccess())

            expect(newState.open).toBe(true)
        })

        test('CASE_CREATION_FAILED', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, createCaseFailure())

            expect(newState.open).toBe(true)
        })
    })

})