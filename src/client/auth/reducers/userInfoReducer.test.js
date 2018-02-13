import userInfoReducer from "./userInfoReducer";
import {userAuthSuccess} from "../actionCreators";

describe('userInfoReducer', () => {
    test('should set default state', () => {
        const newState = userInfoReducer(undefined, {type: 'SOME_ACTION'})
        expect(newState.userInfo).toEqual({nickname:''})
    })
    test('should set nickname state when authentication was successful', () => {
        const newState = userInfoReducer(undefined, userAuthSuccess({nickname:'the.dude'}))
        expect(newState.userInfo).toEqual({nickname:'the.dude'})
    })
});
