import {
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  CIVILIAN_CREATION_SUCCEEDED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  REMOVE_ATTACHMENT_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {}

const caseDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_CASE_DETAILS_SUCCESS':
        case 'NARRATIVE_UPDATE_SUCCEEDED':
        case 'ATTACHMENT_UPLOAD_SUCCEEDED':
        case INCIDENT_DETAILS_UPDATE_SUCCEEDED:
        case REMOVE_ATTACHMENT_SUCCESS:
        case ADD_OFFICER_TO_CASE_SUCCEEDED:
            return mergeOfficerDetails(action.caseDetails);
        case 'EDIT_CIVILIAN_SUCCESS':
        case CIVILIAN_CREATION_SUCCEEDED:
            return {
                ...state,
                status: 'Active',
                civilians: action.civilians
            }
        default:
            return state
    }
}

const mergeOfficerDetails = (caseDetails) => {
    if (!caseDetails.accusedOfficers) { return caseDetails }

    const transformedOfficers = caseDetails.accusedOfficers.map(accusedOfficer => ({
        ...accusedOfficer.officer,
        id: accusedOfficer.id,
        officerId: accusedOfficer.officer.id,
        roleOnCase: accusedOfficer.roleOnCase,
        notes: accusedOfficer.notes
    }));
    caseDetails.accusedOfficers = transformedOfficers
    return caseDetails;
}

export default caseDetailsReducer