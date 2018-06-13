import {
  ADD_CASE_NOTE_SUCCEEDED,
  EDIT_CASE_NOTE_SUCCEEDED,
  GET_RECENT_ACTIVITY_SUCCEEDED,
  REMOVE_CASE_NOTE_SUCCEEDED
} from "../../../sharedUtilities/constants";

const recentActivityReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_CASE_NOTE_SUCCEEDED:
    case GET_RECENT_ACTIVITY_SUCCEEDED:
    case REMOVE_CASE_NOTE_SUCCEEDED:
    case EDIT_CASE_NOTE_SUCCEEDED:
      return action.recentActivity;
    default: {
      return state;
    }
  }
};

export default recentActivityReducer;
