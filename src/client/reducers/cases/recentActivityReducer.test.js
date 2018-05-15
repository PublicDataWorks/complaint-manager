import recentActivityReducer from "./recentActivityReducer";
import {
    addUserActionSuccess,
    getRecentActivitySuccess,
    removeUserActionSuccess
} from "../../actionCreators/casesActionCreators";

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

    test('should replace recent activity after removing user action',()=>{
        const oldState = {some: 'old state'}

        const userActionDetails = {
            details: {
                some: 'new state'
            },
            recentActivity: {
                not: 'copied over'
            }

        }

        const newState = recentActivityReducer(oldState, removeUserActionSuccess(userActionDetails))

        expect(newState).toEqual(userActionDetails.recentActivity)
    })
});