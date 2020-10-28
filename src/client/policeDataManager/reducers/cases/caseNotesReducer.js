import {
  ADD_CASE_NOTE_SUCCEEDED,
  EDIT_CASE_NOTE_SUCCEEDED,
  GET_CASE_NOTES_SUCCEEDED,
  REMOVE_CASE_NOTE_SUCCEEDED
} from "../../../../sharedUtilities/constants";

const caseNotesReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_CASE_NOTE_SUCCEEDED:
    case GET_CASE_NOTES_SUCCEEDED:
    case REMOVE_CASE_NOTE_SUCCEEDED:
    case EDIT_CASE_NOTE_SUCCEEDED:
      return action.caseNotes;
    default: {
      return state;
    }
  }
};

export default caseNotesReducer;
