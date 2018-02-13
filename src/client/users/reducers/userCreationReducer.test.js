import userCreationReducer from './userCreationReducer'
import {requestUserCreation, createUserSuccess, createUserFailure} from '../actionCreators'

describe('userCreationReducer', function () {
    test('should set default state', () => {

        const defaultState = {
            success: false,
            message: ''
        }

        const someAction = {type: 'SOME_TYPE'}
        const newState = userCreationReducer(undefined, someAction)
        expect(newState).toEqual(defaultState)
    })

    describe('USER_CREATION_REQUESTED',() => {
        let newState

        beforeEach( () => {
            newState = userCreationReducer(undefined, requestUserCreation())
        })

        test('should not be successful', () =>{
            expect(newState.success).toBeFalsy()
        })

        test('message should be empty', () => {
            expect(newState.message).toEqual('')
        })
    })

    describe('USER_CREATED_SUCCESS',() => {
        let defaultState, newState

        beforeEach( () => {
            defaultState = {
                success: false,
                message: ''
            }

            newState = userCreationReducer(defaultState, createUserSuccess({user:'someUser'}))
        })

        test('should be successful', () =>{
            expect(newState.success).toBeTruthy()
        })

        test('should have success message', () => {
            expect(newState.message).toEqual('User was successfully created.')
        })
    })

    describe('USER_CREATION_FAILED',() => {
        let defaultState, newState

        beforeEach( () => {
            defaultState = {
                success: true,
                message: ''
            }

            newState = userCreationReducer(defaultState, createUserFailure())
        })

        test('should not be successful', () =>{
            expect(newState.success).toBeFalsy()
        })

        test('should have failure message', () => {
            expect(newState.message).toEqual('Something went wrong on our end and your user was not created. Please try again.')
        })
    })
});