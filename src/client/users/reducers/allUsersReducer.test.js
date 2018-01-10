import allUsersReducer from "./allUsersReducer";
import {createUserSuccess, getUsersSuccess} from "../actionCreators";

describe('allUsersReducer', () => {
    test('should default to empty array', () => {
        const newState = allUsersReducer(undefined, {type: 'SOME_ACTION'});
        expect(newState).toEqual([])
    })

    describe('CREATE_USER_SUCCESS', () => {
        test('should add new user to state', () => {
            const action = createUserSuccess('user details')

            const newState = allUsersReducer([], action)

            expect(newState).toEqual(['user details'])
        })
    })

    describe('GET_USERS_SUCCESS', () => {
        test('should replace all users in state', () =>{
            let currentState = ['Sal', 'Lily']
            let expectedState = ['Ed', 'Brian']
            let newState = allUsersReducer(currentState, getUsersSuccess(expectedState))

            expect(newState).toEqual(expectedState)
        })
    })
})