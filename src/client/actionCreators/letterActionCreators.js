import {
  CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG,
  CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG,
  GET_FINAL_PDF_URL_SUCCESS,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS,
  GET_RECOMMENDED_ACTIONS_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS,
  OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG,
  OPEN_EDIT_LETTER_CONFIRMATION_DIALOG,
  REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED,
  REMOVE_IAPRO_CORRECTION_DIALOG_OPENED,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED,
  START_LETTER_DOWNLOAD,
  STOP_LETTER_DOWNLOAD
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

export const getLetterPreviewSuccess = (
  letterHtml,
  addresses,
  letterType,
  lastEdited,
  finalFilename,
  draftFilename
) => ({
  type: GET_LETTER_PREVIEW_SUCCESS,
  letterHtml,
  addresses,
  letterType,
  lastEdited,
  finalFilename,
  draftFilename
});

export const openEditLetterConfirmationDialog = () => ({
  type: OPEN_EDIT_LETTER_CONFIRMATION_DIALOG
});

export const closeEditLetterConfirmationDialog = () => ({
  type: CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG
});

export const openCancelEditLetterConfirmationDialog = () => ({
  type: OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG
});

export const closeCancelEditLetterConfirmationDialog = () => ({
  type: CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG
});

export const startLetterDownload = () => ({
  type: START_LETTER_DOWNLOAD
});

export const stopLetterDownload = () => ({
  type: STOP_LETTER_DOWNLOAD
});

export const getLetterPdfSuccess = letterPdf => ({
  type: GET_LETTER_PDF_SUCCESS,
  letterPdf
});

export const getFinalPdfUrlSuccess = finalPdfUrl => ({
  type: GET_FINAL_PDF_URL_SUCCESS,
  finalPdfUrl
});
