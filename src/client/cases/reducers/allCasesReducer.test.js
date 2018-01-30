import allCasesReducer from './allCasesReducer'
import {createCaseSuccess, getCasesSuccess, updateNarrativeSuccess} from '../actionCreators'

describe('allCasesReducer', () => {
    test('should default to empty array', () => {
        const newState = allCasesReducer(undefined, {type: 'SOME_ACTION'})
        expect(newState).toEqual([])
    })

    describe('GET_CASES_SUCCESS', () => {
        test('should replace all cases in state', () => {
            const oldState = ['case a', 'case b']
            const action = getCasesSuccess(['case 1', 'case 2'])

            const newState = allCasesReducer(oldState, action)

            expect(newState).toEqual(action.cases)
        })
    })

    describe('CASE_CREATED_SUCCESS', () => {
        test('should add new case to state', () => {
            const action = createCaseSuccess('case details');

            const newState = allCasesReducer([], action)

            expect(newState).toEqual(['case details'])
        })
    })

    describe('NARRATIVE_UPDATE_SUCCEEDED', () => {
        test('should update case with new narrative', () => {
            const oldState = [{id: 1, narrative: null}, {id: 2, narrative: null}]
            const action = updateNarrativeSuccess({id: 1, narrative: 'a new narrative'})

            const newState = allCasesReducer(oldState, action)

            expect(oldState[0]).toEqual({id: 1, narrative: null})
            expect(newState[0]).toEqual({id: 1, narrative: 'a new narrative'})
        })
    });
})