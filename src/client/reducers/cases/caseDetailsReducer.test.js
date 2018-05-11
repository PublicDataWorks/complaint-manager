import caseDetailsReducer from "./caseDetailsReducer";
import {
    addUserActionSuccess,
    createCivilianSuccess,
    editCivilianSuccess,
    getCaseDetailsSuccess, removeCivilianSuccess,
    updateIncidentDetailsSuccess,
    updateNarrativeSuccess,
    uploadAttachmentSuccess
} from "../../actionCreators/casesActionCreators";
import {removeAttachmentSuccess} from "../../actionCreators/attachmentsActionCreators";
import {
    ADD_OFFICER_TO_CASE_SUCCEEDED,
    CIVILIAN_CREATION_SUCCEEDED,
    REMOVE_ATTACHMENT_SUCCESS
} from "../../../sharedUtilities/constants";
import {addOfficerToCaseSuccess} from "../../actionCreators/officersActionCreators";

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

            const caseDetails = {caseDetailProp: 'new detail value'}
            const action = updateNarrativeSuccess(caseDetails)

            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(caseDetails)
        })
    })

    describe('INCIDENT_DETAILS_UPDATE_SUCCEEDED', () => {
        test("updates the case details", () => {
            const oldState = {caseDetailProp: 'old detail value'}

            const caseDetails = {caseDetailProp: 'new detail value'}
            const action = updateIncidentDetailsSuccess(caseDetails)

            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(caseDetails)
        });
    })

    describe(ADD_OFFICER_TO_CASE_SUCCEEDED, () => {
        test("updates case details", () => {
            const oldState = {caseDetailProp: 'old detail value'}

            const caseDetails = {caseDetailProp: 'new detail value'}
            const action = addOfficerToCaseSuccess(caseDetails)

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
        test('should replace civilians array and leave rest of object untouched except status when editing civilian', () => {
            const oldState = {status: 'Initial', left: 'untouched', civilians: [{some: 'someString'}]}
            const newCivilianDetail = [{gender: 'other'}]

            const action = editCivilianSuccess(newCivilianDetail)

            const newState = caseDetailsReducer(oldState, action)

            const expectedState = {status: 'Active', left: 'untouched', civilians: [{'gender': 'other'}]}
            expect(newState).toEqual(expectedState)
        })
    })

    describe(CIVILIAN_CREATION_SUCCEEDED, () => {
        test('should replace civilians array and leave rest of object untouched except status when adding civilian', () => {
            const oldState = {status: 'Initial', left: 'untouched', civilians: [{some: 'someString'}]}
            const newCivilians = [{someNew: 'thingToReplaceCivilians'}, {some: 'someString'}]

            const action = createCivilianSuccess(newCivilians)

            const newState = caseDetailsReducer(oldState, action)

            const expectedState = {
                status: 'Active',
                left: 'untouched',
                civilians: [{someNew: 'thingToReplaceCivilians'}, {some: 'someString'}]
            }
            expect(newState).toEqual(expectedState)
        })
    })

    describe(REMOVE_ATTACHMENT_SUCCESS, () => {
        test('should update attachments when attachment removed', () => {
            const oldState = {
                attachment: [
                    {fileName: 'sample.text'},
                    {fileName: 'cool.jpg'}
                ]
            }
            const updatedCaseDetails = {
                attachment: [
                    {fileName: 'cool.jpg'}
                ]
            }

            const action = removeAttachmentSuccess(updatedCaseDetails)
            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(updatedCaseDetails)
        })
    });

    describe('ADD_USER_ACTION_SUCCEEDED', () => {
        test('should set case status to Active if Initial', () => {
            const caseDetails = {status: 'Initial'}
            const newState = caseDetailsReducer(caseDetails, addUserActionSuccess())

            expect(newState).toEqual({status: 'Active'})
        })
    });

    describe('REMOVED_CIVILIAN_SUCCEEDED', () => {
        test('should update current case after civilian is removed', () => {
           const oldCaseDetails = {
               civilians: [{id:1}]
           }

           const newCaseDetails = {
               civilians:[]
           }

           const newState = caseDetailsReducer(oldCaseDetails, removeCivilianSuccess(newCaseDetails))

            expect(newState).toEqual(newCaseDetails)
        })
    });
})