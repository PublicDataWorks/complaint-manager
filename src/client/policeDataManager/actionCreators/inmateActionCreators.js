import {
  CLEAR_SELECTED_INMATE,
  CLEAR_SELECTED_INMATE_SUCCEEDED
} from "../../../sharedUtilities/constants";

export const removeSelectedInmate = () => ({
  type: CLEAR_SELECTED_INMATE
});

export const removeSelectedInmateSucceeded = currentCase => ({
  type: CLEAR_SELECTED_INMATE_SUCCEEDED,
  caseDetails: currentCase.caseDetails,
  caseInmate: currentCase.caseInmate
});
