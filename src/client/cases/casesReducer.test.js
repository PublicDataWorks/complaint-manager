import casesReducer from './casesReducer'
import {createCaseSuccess} from "./actionCreators";

describe('casesReducer', () => {
    test('should default to empty array', () => {
        const newState = casesReducer(undefined, {type: 'SOME_ACTION'})
        expect(newState).toEqual([])
    })

    describe('CASE_CREATED_SUCCESS', () => {
        test('should add new case to state', () => {
            const action = createCaseSuccess('case details');

            const newState = casesReducer([], action)

            expect(newState).toEqual(['case details'])
        })

        test('should not mutate the cases store', () => {
            const action = createCaseSuccess('case details');
            const originalState = []

            casesReducer(originalState, action)

            expect(originalState).toEqual([])
        })
    })
})