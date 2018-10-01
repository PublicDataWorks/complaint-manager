import {
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED
} from "../../sharedUtilities/constants";

export const openRemoveOfficerHistoryNoteDialog = (
  fieldArrayName,
  noteIndex,
  noteDetails
) => ({
  type: REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED,
  fieldArrayName,
  noteIndex,
  noteDetails
});

export const closeRemoveOfficerHistoryNoteDialog = () => ({
  type: REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED
});
