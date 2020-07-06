import {
  CLEAR_HIGHLIGHTED_CASE_NOTE,
  HIGHLIGHT_CASE_NOTE
} from "../../../sharedUtilities/constants";

export const highlightCaseNote = caseNoteId => ({
  type: HIGHLIGHT_CASE_NOTE,
  caseNoteId: caseNoteId
});

export const clearHighlightedCaseNote = () => ({
  type: CLEAR_HIGHLIGHTED_CASE_NOTE,
  caseNoteId: null
});
