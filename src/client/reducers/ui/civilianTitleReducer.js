import { GET_CIVILIAN_TITLES_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const civilianTitleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CIVILIAN_TITLES_SUCCEEDED:
      return action.civilianTitles;
    default:
      return state;
  }
};

export default civilianTitleReducer;
