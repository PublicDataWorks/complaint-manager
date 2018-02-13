import snackbarReducer from "./snackbarReducer";
import {
    createUserFailure, createUserSuccess,
    requestUserCreation
} from "../users/actionCreators";
import {
    createCaseFailure, createCaseSuccess, requestCaseCreation, updateNarrativeFailure,
    updateNarrativeSuccess
} from "../cases/actionCreators";
import {closeSnackbar, openSnackbar} from "./actionCreators";

describe('snackbarReducer', () => {
    test('should default open to false', () => {
        const state = snackbarReducer(undefined, {type: "SOME_ACTION"})
        expect(state.open).toEqual(false)
        expect(state.success).toEqual(false)
        expect(state.message).toEqual('')
    })

    describe('OPEN_SNACKBAR', () => {
        test('should set open to true', () => {
            const state = snackbarReducer(undefined, openSnackbar())
            expect(state.open).toEqual(true)
        })

        test('should not mutate state', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, openSnackbar())

            expect(newState.open).not.toEqual(initialState)
        })
    });

    describe('CLOSE_SNACKBAR', () => {
        test('should set open to false', () => {
            const initialState = {open: true}

            const state = snackbarReducer(initialState, closeSnackbar())

            expect(state.open).toBe(false)
        })

        test('should not mutate state', () => {
            const initialState = {open: true}
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
            const id = 1
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, createCaseSuccess({id: id}))

            expect(newState.open).toBe(true)
            expect(newState.success).toEqual(true)
            expect(newState.message).toEqual(`Case ${id} was successfully created.`)
        })

        test('CASE_CREATION_FAILED', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, createCaseFailure())

            expect(newState.open).toBe(true)
        })
    })

    describe('NARRATIVE_UPDATE', () => {
        describe('NARRATIVE_UPDATE_SUCCEEDED', () => {
            test('should set state correctly on successful update', () => {
                const newState = snackbarReducer(undefined, updateNarrativeSuccess('some case'))
                expect(newState.open).toEqual(true)
                expect(newState.success).toEqual(true)
                expect(newState.message).toEqual('Your narrative was successfully updated')
            })
        })

        describe('NARRATIVE_UPDATE_FAILED', () => {
            test('should set state correctly', () => {
                const initialState = {success: true, message: 'some message', open: false}
                const newState = snackbarReducer(initialState, updateNarrativeFailure('some case'))

                expect(newState.success).toEqual(false)
                expect(newState.message).toEqual('Something went wrong on our end and your case was not updated. Please try again.')
                expect(newState.open).toBeTruthy()
            })

        })
    })

})