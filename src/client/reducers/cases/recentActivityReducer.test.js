import recentActivityReducer from "./recentActivityReducer";
import {addUserActionSuccess, getRecentActivitySuccess} from "../../actionCreators/casesActionCreators";

describe('recentActivityReducer', () => {
    test('should set default state', () => {
        const newState = recentActivityReducer(undefined, {type: 'SOME_ACTION'})

        expect(newState).toEqual([])
    })

    test('should return recent activity array after successful get', () => {
        const expectedRecentActivity = ['action 1', 'action 2']
        const newState = recentActivityReducer([], getRecentActivitySuccess(expectedRecentActivity))

        expect(newState).toEqual(expectedRecentActivity)
    })

    test('should return recent activity after user action logged', () => {
        const expectedRecentActivity = ['action 1', 'action 2']

        const newState = recentActivityReducer([], addUserActionSuccess(expectedRecentActivity))
        expect(newState).toEqual(expectedRecentActivity)
    })
});