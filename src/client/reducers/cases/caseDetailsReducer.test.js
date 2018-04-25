import caseDetailsReducer from "./caseDetailsReducer";
import {
    createCivilianSuccess,
    editCivilianSuccess,
    getCaseDetailsSuccess,
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

        test('merges officer with accusedOfficer', () => {
            const caseDetails = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officer: {id: 1, firstName: 'Monica', lastName: 'Smith'}}]};
            const newState = caseDetailsReducer({}, getCaseDetailsSuccess(caseDetails))
            const expectedNewState = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officerId: 1, firstName: 'Monica', lastName: 'Smith'}]};
            expect(newState).toEqual(expectedNewState);
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

        test('merges officer with accusedOfficer', () => {
            const caseDetails = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officer: {id: 1, firstName: 'Monica', lastName: 'Smith'}}]};
            const newState = caseDetailsReducer({}, updateNarrativeSuccess(caseDetails))
            const expectedNewState = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officerId: 1, firstName: 'Monica', lastName: 'Smith'}]};
            expect(newState).toEqual(expectedNewState);
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

        test('merges officer with accusedOfficer', () => {
            const caseDetails = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officer: {id: 1, firstName: 'Monica', lastName: 'Smith'}}]};
            const newState = caseDetailsReducer({}, updateNarrativeSuccess(caseDetails))
            const expectedNewState = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officerId: 1, firstName: 'Monica', lastName: 'Smith'}]};
            expect(newState).toEqual(expectedNewState);
        })
    })

    describe(ADD_OFFICER_TO_CASE_SUCCEEDED, () => {
        test("updates case details", () => {
            const oldState = {caseDetailProp: 'old detail value'}

            const caseDetails = {caseDetailProp: 'new detail value'}
            const action = addOfficerToCaseSuccess(caseDetails)

            const newState = caseDetailsReducer(oldState, action)

            expect(newState).toEqual(caseDetails)
        })

        test('merges officer with accusedOfficer', () => {
            const caseDetails = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officer: {id: 1, firstName: 'Monica', lastName: 'Smith'}}]};
            const newState = caseDetailsReducer({}, addOfficerToCaseSuccess(caseDetails))
            const expectedNewState = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officerId: 1, firstName: 'Monica', lastName: 'Smith'}]};
            expect(newState).toEqual(expectedNewState);
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

        test('merges officer with accusedOfficer', () => {
            const caseDetails = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officer: {id: 1, firstName: 'Monica', lastName: 'Smith'}}]};
            const newState = caseDetailsReducer({}, uploadAttachmentSuccess(caseDetails))
            const expectedNewState = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officerId: 1, firstName: 'Monica', lastName: 'Smith'}]};
            expect(newState).toEqual(expectedNewState);
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

            const expectedState = {status: 'Active', left: 'untouched', civilians: [{someNew: 'thingToReplaceCivilians'}, {some: 'someString'}]}
            expect(newState).toEqual(expectedState)
        })
    })

    describe(REMOVE_ATTACHMENT_SUCCESS, () => {
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

        test('merges officer with accusedOfficer', () => {
            const caseDetails = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officer: {id: 1, firstName: 'Monica', lastName: 'Smith'}}]};
            const newState = caseDetailsReducer({}, removeAttachmentSuccess(caseDetails))
            const expectedNewState = {accusedOfficers: [{id: 5, notes: 'note', roleOnCase: 'Accused', officerId: 1, firstName: 'Monica', lastName: 'Smith'}]};
            expect(newState).toEqual(expectedNewState);
        })
    });
})