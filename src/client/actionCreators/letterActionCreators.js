import {
  GET_REFERRAL_LETTER_SUCCESS,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED,
  REMOVE_IAPRO_CORRECTION_DIALOG_OPENED,
  REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED,
  GET_RECOMMENDED_ACTIONS_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS,
  OPEN_EDIT_LETTER_CONFIRMATION_DIALOG,
  CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG
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

export const openRemoveIAProCorrectionDialog = (
  fieldArrayName,
  correctionIndex
) => ({
  type: REMOVE_IAPRO_CORRECTION_DIALOG_OPENED,
  fieldArrayName,
  correctionIndex
});

export const closeRemoveIAProCorrectionDialog = () => ({
  type: REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED
});

export const getReferralLetterSuccess = letterDetails => ({
  type: GET_REFERRAL_LETTER_SUCCESS,
  letterDetails
});

export const getRecommendedActionsSuccess = recommendedActions => ({
  type: GET_RECOMMENDED_ACTIONS_SUCCESS,
  recommendedActions
});

export const getLetterPreviewSuccess = (letterHtml, addresses) => ({
  type: GET_LETTER_PREVIEW_SUCCESS,
  letterHtml,
  addresses
});

export const openEditLetterConfirmationDialog = () => ({
  type: OPEN_EDIT_LETTER_CONFIRMATION_DIALOG
});

export const closeEditLetterConfirmationDialog = () => ({
  type: CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG
});
