import {
    ADD_USER_ACTION_SUCCEEDED, EDIT_USER_ACTION_SUCCEEDED,
    GET_RECENT_ACTIVITY_SUCCEEDED,
    REMOVE_USER_ACTION_SUCCEEDED
} from "../../../sharedUtilities/constants";

const recentActivityReducer = (state = [], action) => {
    switch (action.type){
        case ADD_USER_ACTION_SUCCEEDED:
        case GET_RECENT_ACTIVITY_SUCCEEDED:
        case REMOVE_USER_ACTION_SUCCEEDED:
        case EDIT_USER_ACTION_SUCCEEDED:
            return action.recentActivity
        default:{
            return state
        }
    }
}

export default recentActivityReducer