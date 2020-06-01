import { FETCHING_CASE_TAGS } from "../../../../sharedUtilities/constants";

const fetchingCaseTagsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHING_CASE_TAGS:
      return action.fetching;
    default: {
      return state;
    }
  }
};

export default fetchingCaseTagsReducer;
