import {
  GET_REFERRAL_LETTER_SUCCESS,
  EDIT_REFERRAL_LETTER_SUCCESS,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED,
  REMOVE_IAPRO_CORRECTION_DIALOG_OPENED,
  REMOVE_IAPRO_CORRECTION_DIALOG_CLOSED,
  EDIT_IAPRO_CORRECTION_SUCCESS,
  EDIT_RECOMMENDED_ACTIONS_SUCCESS,
  GET_RECOMMENDED_ACTIONS_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS
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

export const editReferralLetterSuccess = letterDetails => ({
  type: EDIT_REFERRAL_LETTER_SUCCESS,
  letterDetails
});

export const editIAProCorrectionsSuccess = letterDetails => ({
  type: EDIT_IAPRO_CORRECTION_SUCCESS,
  letterDetails
});

export const editRecommendedActionsSuccess = letterDetails => ({
  type: EDIT_RECOMMENDED_ACTIONS_SUCCESS,
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
