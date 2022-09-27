import {
  CLEAR_LETTER_TYPE_TO_EDIT,
  SET_LETTER_TYPE_TO_EDIT
} from "../../../../sharedUtilities/constants";

const initialState = {};

const editLetterTypeReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_LETTER_TYPE_TO_EDIT:
      return action.payload;
    case CLEAR_LETTER_TYPE_TO_EDIT:
      return initialState;
    default:
      return state;
  }
};

export default editLetterTypeReducer;
