import userCreationReducer from './userCreationReducer'
import {requestUserCreation, createUserSuccess} from './actionCreators'

describe('userCreationReducer', function () {
    test('should set default state', () => {

        const defaultState = {
            inProgress: false,
            success: false,
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


        test('should be in progress', () =>{
            expect(newState.inProgress).toBeTruthy()
        })

        test('should not be successful', () =>{
            expect(newState.success).toBeFalsy()
        })
    })

    describe('USER_CREATED_SUCCESS',() => {
        let defaultState, newState

        beforeEach( () => {
            defaultState = {
                inProgress: true,
                success: false,
            }

            newState = userCreationReducer(defaultState, createUserSuccess({user:'someUser'}))
        })

        test('should not be in progress', () =>{
            expect(newState.inProgress).toBeFalsy()
        })

        test('should be successful', () =>{
            expect(newState.success).toBeTruthy()

        })
    })
});