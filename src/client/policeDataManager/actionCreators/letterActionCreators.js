import {
  CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG,
  CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG,
  CLOSE_INCOMPLETE_CLASSIFICATIONS_DIALOG,
  CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG,
  CLOSE_MISSING_COMPLAINANT_DIALOG,
  FINISH_LOADING_PDF_PREVIEW,
  GET_CLASSIFICATIONS_SUCCESS,
  GET_RECOMMENDED_ACTIONS_SUCCESS,
  GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS,
  GET_REFERRAL_LETTER_PDF_SUCCESS,
  GET_REFERRAL_LETTER_PREVIEW_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS,
  OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG,
  OPEN_EDIT_LETTER_CONFIRMATION_DIALOG,
  OPEN_INCOMPLETE_CLASSIFICATION_DIALOG,
  OPEN_INCOMPLETE_OFFICER_HISTORY_DIALOG,
  OPEN_MISSING_COMPLAINANT_DIALOG,
  START_LETTER_DOWNLOAD,
  START_LOADING_PDF_PREVIEW,
  STOP_LETTER_DOWNLOAD
} from "../../../sharedUtilities/constants";

export const getReferralLetterSuccess = letterDetails => ({
  type: GET_REFERRAL_LETTER_SUCCESS,
  letterDetails
});

export const getRecommendedActionsSuccess = recommendedActions => ({
  type: GET_RECOMMENDED_ACTIONS_SUCCESS,
  recommendedActions
});

export const getClassificationsSuccess = classifications => ({
  type: GET_CLASSIFICATIONS_SUCCESS,
  classifications
});

export const getReferralLetterPreviewSuccess = (
  letterHtml,
  addresses,
  editStatus,
  lastEdited,
  finalFilename,
  draftFilename
) => ({
  type: GET_REFERRAL_LETTER_PREVIEW_SUCCESS,
  letterHtml,
  addresses,
  editStatus,
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

export const startLoadingPdfPreview = () => ({
  type: START_LOADING_PDF_PREVIEW
});

export const finishLoadingPdfPreview = () => ({
  type: FINISH_LOADING_PDF_PREVIEW
});

export const getReferralLetterPdfSuccess = letterPdf => ({
  type: GET_REFERRAL_LETTER_PDF_SUCCESS,
  letterPdf
});

export const getReferralLetterEditStatusSuccess = editStatus => ({
  type: GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS,
  editStatus
});

export const openIncompleteOfficerHistoryDialog = officerIndex => ({
  type: OPEN_INCOMPLETE_OFFICER_HISTORY_DIALOG,
  officerIndex
});

export const closeIncompleteOfficerHistoryDialog = () => ({
  type: CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG
});

export const openIncompleteClassificationsDialog = () => ({
  type: OPEN_INCOMPLETE_CLASSIFICATION_DIALOG
});

export const closeIncompleteClassificationsDialog = () => ({
  type: CLOSE_INCOMPLETE_CLASSIFICATIONS_DIALOG
});

export const openMissingComplainantDialog = () => ({
  type: OPEN_MISSING_COMPLAINANT_DIALOG
});

export const closeMissingComplainantDialog = () => ({
  type: CLOSE_MISSING_COMPLAINANT_DIALOG
});
