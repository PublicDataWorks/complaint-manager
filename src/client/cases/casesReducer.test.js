import allCasesReducer from './allCasesReducer'
import {createCaseSuccess} from "./actionCreators";

describe('allCasesReducer', () => {
    test('should default to empty array', () => {
        const newState = allCasesReducer(undefined, {type: 'SOME_ACTION'})
        expect(newState).toEqual([])
    })

    describe('CASE_CREATED_SUCCESS', () => {
        test('should add new case to state', () => {
            const action = createCaseSuccess('case details');

            const newState = allCasesReducer([], action)

            expect(newState).toEqual(['case details'])
        })

        test('should not mutate the cases store', () => {
            const action = createCaseSuccess('case details');
            const originalState = []

            allCasesReducer(originalState, action)

            expect(originalState).toEqual([])
        })
    })
})