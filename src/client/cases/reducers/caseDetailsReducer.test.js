import caseDetailsReducer from "./caseDetailsReducer";
import {getCaseDetailsSuccess, updateNarrativeSuccess} from "../actionCreators";

describe('caseDetailsReducers', () => {
    test('should default to empty object', () => {
        const newState = caseDetailsReducer(undefined, {type: 'ACTION'})
        expect(newState).toEqual({})
    })

    describe('GET_CASE_DETAILS_SUCCESS', () => {
        test('should replace the default object in state', () => {
            const oldState = {aProp: 'a value', bProp: 'b value'}

            const caseDetails = {caseDetailProp: 'case detail value'}
            const action = getCaseDetailsSuccess(caseDetails)

            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(caseDetails)
        })
    })

    describe('NARRATIVE_UPDATE_SUCCEEDED', () => {
        test('should update current case details', () => {
            const oldState = {caseDetailProp: 'old detail value'}

            const caseDetails = {caseDetailProp: 'new  detail value'}
            const action = updateNarrativeSuccess(caseDetails)

            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(caseDetails)
        })
    })
})