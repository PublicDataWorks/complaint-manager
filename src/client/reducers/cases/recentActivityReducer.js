import {GET_RECENT_ACTIVITY_SUCCEEDED} from "../../../sharedUtilities/constants";

const recentActivityReducer = (state = [], action) => {
    switch (action.type){
        case GET_RECENT_ACTIVITY_SUCCEEDED: {
            return action.recentActivity
        }
        default:{
            return state
        }
    }
}

export default recentActivityReducer