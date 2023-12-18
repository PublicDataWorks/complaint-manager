import { GET_PRIORITY_REASONS_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const priorityReasonsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRIORITY_REASONS_SUCCEEDED:
        return action.priorityReasons;
        default:
        return state;
    }
    }

export default priorityReasonsReducer;