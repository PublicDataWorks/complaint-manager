import { GET_TAGS_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS_SUCCEEDED:
      return action.tags;
    default:
      return state;
  }
};

export default tagReducer;
