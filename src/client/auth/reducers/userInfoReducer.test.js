import userInfoReducer from "./userInfoReducer";
import {userAuthSuccess} from "../actionCreators";

describe('userInfoReducer', () => {
    test('should set default state', () => {
        const newState = userInfoReducer(undefined, {type: 'SOME_ACTION'})
        expect(newState.userInfo).toEqual({nickname:'', permissions: []})
    })
    test('should set nickname state when authentication was successful', () => {
        const newState = userInfoReducer(undefined, userAuthSuccess({nickname:'the.dude', permissions: ['read:users']}))
        expect(newState.userInfo).toEqual({nickname:'the.dude', permissions: ['read:users']})
    })
});
