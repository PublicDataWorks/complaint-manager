import caseDetailsReducer from "./caseDetailsReducer";
import {
    editCivilianSuccess, getCaseDetailsSuccess, updateNarrativeSuccess,
    uploadAttachmentSuccess
} from "../../actionCreators/casesActionCreators";
import {removeAttachmentSuccess} from "../../actionCreators/attachmentsActionCreators";
import {REMOVE_ATTACHMENTS_SUCCESS} from '../../../../src/sharedUtilities/constants.js'

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

    describe('ATTACHMENT_UPLOAD_SUCCEEDED', () => {
        test('should update current case details', () => {
            const oldState = {caseDetailProp: 'old detail value'}

            const caseDetails = {caseDetailProp: 'new  detail value'}
            const action = uploadAttachmentSuccess(caseDetails)

            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(caseDetails)
        })
    })

    describe('EDIT_CIVILIAN_SUCCESS', () => {
        test('should update civilian information', () => {
            const oldState = {status: 'Initial', left: 'untouched', civilians: [{some: 'someString'}]}
            const newCivilianDetail = [{gender: 'other'}]

            const action = editCivilianSuccess(newCivilianDetail)

            const newState = caseDetailsReducer(oldState, action)

            const expectedState = {status: 'Active', left: 'untouched', civilians: [{'gender': 'other'}]}
            expect(newState).toEqual(expectedState)
        })
    });

    describe(REMOVE_ATTACHMENTS_SUCCESS, () => {
        test('should update attachments when attachment removed', () => {
            const oldState = {
                attachment: [
                    {fileName:'sample.text'},
                    {fileName:'cool.jpg'}
                ]
            }
            const updatedCaseDetails = {
                attachment: [
                    {fileName:'cool.jpg'}
                ]
            }

            const action = removeAttachmentSuccess(updatedCaseDetails)
            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(updatedCaseDetails)
        })
    });
})