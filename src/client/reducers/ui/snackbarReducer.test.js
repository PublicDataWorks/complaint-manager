import snackbarReducer from "./snackbarReducer";
import {createUserFailure, createUserSuccess, requestUserCreation} from "../../actionCreators/usersActionCreators";
import {
    createCaseFailure,
    createCaseSuccess, editCivilianFailed, editCivilianSuccess,
    requestCaseCreation,
    updateNarrativeFailure,
    updateNarrativeSuccess
} from "../../actionCreators/casesActionCreators";
import {closeSnackbar} from "../../actionCreators/snackBarActionCreators";

describe('snackbarReducer', () => {
    test('should default open to false', () => {
        const state = snackbarReducer(undefined, {type: "SOME_ACTION"})
        expect(state.open).toEqual(false)
        expect(state.success).toEqual(false)
        expect(state.message).toEqual('')
    })

    describe('CLOSE_SNACKBAR', () => {
        test('should set open to false', () => {
            const initialState = {open: true, success: false, message: 'You failed'}

            const state = snackbarReducer(initialState, closeSnackbar())

            expect(state.open).toBe(false)
            expect(state.success).toBe(false)
            expect(state.message).toBe('You failed')
        })
    })

    describe('USER_CREATION', () => {
        test('USER_CREATION_REQUESTED', () => {
            const initialState = {open: true, success: true, message: 'blah'}
            const newState = snackbarReducer(initialState, requestUserCreation())

            expect(newState.open).toBe(false)
            expect(newState.success).toBe(false)
            expect(newState.message).toBe('')
        })

        test('USER_CREATED_SUCCESS', () => {
            const initialState = {open: false, success: false, message: 'blah'}
            const newState = snackbarReducer(initialState, createUserSuccess())

            expect(newState.open).toBe(true)
            expect(newState.success).toBe(true)
            expect(newState.message).toBe('User was successfully created.')
        })

        test('USER_CREATION_FAILED', () => {
            const initialState = {open: false, success: true, message: 'blah'}
            const newState = snackbarReducer(initialState, createUserFailure())

            expect(newState.open).toBe(true)
            expect(newState.success).toBeFalsy()
            expect(newState.message).toBe('Something went wrong on our end and your user was not created. Please try again.')
        })
    })

    describe('CASE_CREATION', () => {
        test('CASE_CREATION_REQUESTED', () => {
            const initialState = {open: true, success: true, message: 'balh'}
            const newState = snackbarReducer(initialState, requestCaseCreation())

            expect(newState.open).toBe(false)
            expect(newState.success).toEqual(false)
            expect(newState.message).toEqual('')
        })

        test('CASE_CREATED_SUCCESS', () => {
            const id = 1
            const initialState = {open: false, success: false, message: 'blah'}
            const newState = snackbarReducer(initialState, createCaseSuccess({id: id}))

            expect(newState.open).toBe(true)
            expect(newState.success).toEqual(true)
            expect(newState.message).toEqual(`Case ${id} was successfully created.`)
        })

        test('CASE_CREATION_FAILED', () => {
            const initialState = {open: false, success: true, message: ''}
            const newState = snackbarReducer(initialState, createCaseFailure({error: 500}))

            expect(newState.open).toBe(true)
            expect(newState.success).toBe(false)
            expect(newState.message).toEqual(
                'Something went wrong on our end and your case was not created. Please try again.')
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
    describe('EDIT_CIVILIAN', () => {
        test('EDIT_CIVILIAN_SUCCESS', () => {
            const initialState = {open: false}
            const newState = snackbarReducer(initialState, editCivilianSuccess())

            expect(newState.open).toBeTruthy()
            expect(newState.success).toBeTruthy()
            expect(newState.message).toEqual('Complainant & Witnesses successfully updated')

        })
        test('EDIT_CIVILIAN_FAILED', () => {
            const initialState = {open: true}
            const newState = snackbarReducer(initialState, editCivilianFailed())

            expect(newState.open).toBeTruthy()
            expect(newState.success).toBeFalsy()
            expect(newState.message).toEqual('Something went wrong on our end and the civilian was not updated. Please try again.')
        })
    })
})