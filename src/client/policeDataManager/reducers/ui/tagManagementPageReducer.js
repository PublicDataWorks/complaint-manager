import {
  GET_TAGS_SUCCEEDED,
  GET_TAGS_CLEARED,
  GET_TAGS_FAILED
} from "../../../../sharedUtilities/constants";

const initialState = {
  loading: true
};

const tagManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS_SUCCEEDED:
    case GET_TAGS_FAILED:
      return {
        ...state,
        loading: false
      };
    case GET_TAGS_CLEARED:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export default tagManagementReducer;
