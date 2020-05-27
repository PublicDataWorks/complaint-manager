import { FETCHING_CASE_NOTES } from "../../../../sharedUtilities/constants";

const fetchingCaseNotesReducer = (state = [], action) => {
  switch (action.type) {
    case FETCHING_CASE_NOTES:
      return action.fetching;
    default: {
      return state;
    }
  }
};

export default fetchingCaseNotesReducer;
