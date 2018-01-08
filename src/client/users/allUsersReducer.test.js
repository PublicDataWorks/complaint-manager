import allUsersReducer from "./allUsersReducer";
import {createUserSuccess} from "./actionCreators";

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
})