import {
  HIGHLIGHT_CASE_NOTE,
  CLEAR_HIGHLIGHTED_CASE_NOTE
} from "../../../../sharedUtilities/constants";

const initialState = {
  caseNoteId: null
};

const highlightCaseNoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case HIGHLIGHT_CASE_NOTE:
      return {
        caseNoteId: action.caseNoteId
      };
    case CLEAR_HIGHLIGHTED_CASE_NOTE:
      return {
        caseNoteId: null
      };
    default:
      return state;
  }
};

export default highlightCaseNoteReducer;
