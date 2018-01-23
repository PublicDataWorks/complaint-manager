import redirectToCaseDetailReducer from "./redirectToCaseDetailReducer";
import {clearRedirectToCaseDetail, createCaseFailure, createCaseSuccess, redirectToCaseDetail} from "../actionCreators";

describe('redirectToCaseDetailReducer', () => {
    test('should set up default state', () => {
        const newState = redirectToCaseDetailReducer(undefined, {type: 'ACTION'})

        expect(newState.redirect).toEqual(false)
        expect(newState.caseId).toEqual('')
    })

    test('should set redirect to true and should not alter caseId when redirect requested', () => {
        const initialState = {redirect: false, caseId: 3}
        const newState = redirectToCaseDetailReducer(initialState, redirectToCaseDetail())

        expect(newState.redirect).toEqual(true)
        expect(newState.caseId).toEqual(initialState.caseId)
    })

    test('should set caseId and should not alter redirect when case successfully created', () => {
        const initialState = {redirect: false, caseId: ''}
        const newState = redirectToCaseDetailReducer(initialState, createCaseSuccess({id: 1}))

        expect(newState.redirect).toEqual(initialState.redirect)
        expect(newState.caseId).toEqual(1)
    })

    test('redirect should be false and caseId should not contain id when clear requested', () => {
        const initialState = {redirect: true, caseId: 3}
        const newState = redirectToCaseDetailReducer(initialState, clearRedirectToCaseDetail())

        expect(newState.redirect).toEqual(false)
        expect(newState.caseId).toEqual('')
    })

    test('redirect should be false and caseId should not contain id when case creation failed', () => {
        const initialState = {redirect: true, caseId: 3}
        const newState = redirectToCaseDetailReducer(initialState, createCaseFailure())

        expect(newState.redirect).toEqual(false)
        expect(newState.caseId).toEqual('')
    })
})