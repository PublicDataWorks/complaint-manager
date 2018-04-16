import {INCIDENT_LOCATION_AUTOSUGGEST_VALUE_UPDATED} from "../../../sharedUtilities/constants";

const initialState = {autoSuggestValue: ''}
const incidentDetailsDialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case INCIDENT_LOCATION_AUTOSUGGEST_VALUE_UPDATED:
            return {
                autoSuggestValue: action.autoSuggestValue
            }
        default:
            return state
    }

}

export default incidentDetailsDialogReducer