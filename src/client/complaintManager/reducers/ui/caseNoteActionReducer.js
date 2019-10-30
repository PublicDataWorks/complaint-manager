import { GET_CASE_NOTE_ACTIONS_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const caseNoteActionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CASE_NOTE_ACTIONS_SUCCEEDED:
      return action.caseNoteActions;
    default:
      return state;
  }
};

export default caseNoteActionReducer;
