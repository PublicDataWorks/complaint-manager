import {
  CREATE_CASE_TAG_SUCCESS,
  GET_CASE_TAG_SUCCESS,
  REMOVE_CASE_TAG_SUCCESS
} from "../../../../sharedUtilities/constants";

const caseTagsReducer = (state = [], action) => {
  switch (action.type) {
    case GET_CASE_TAG_SUCCESS:
    case CREATE_CASE_TAG_SUCCESS:
    case REMOVE_CASE_TAG_SUCCESS:
      return action.caseTags;
    default: {
      return state;
    }
  }
};

export default caseTagsReducer;
