import {
  ADD_OFFICER_ALLEGATION_SUCCEEDED,
  EDIT_ALLEGATION_FORM_CLOSED,
  EDIT_ALLEGATION_FORM_DATA_CLEARED,
  EDIT_ALLEGATION_FORM_OPENED,
  GET_ALLEGATIONS_FAILED,
  GET_ALLEGATIONS_SUCCEEDED,
  REMOVE_ALLEGATION_DIALOG_OPENED,
  REMOVE_ALLEGATION_DIALOG_CLOSED,
  REMOVE_OFFICER_ALLEGATION_FAILED,
  REMOVE_OFFICER_ALLEGATION_SUCCEEDED
} from "../../sharedUtilities/constants";

export const getAllegationsSuccess = allegations => ({
  type: GET_ALLEGATIONS_SUCCEEDED,
  allegations
});

export const getAllegationsFailed = () => ({
  type: GET_ALLEGATIONS_FAILED
});

export const createOfficerAllegationSuccess = caseDetails => ({
  type: ADD_OFFICER_ALLEGATION_SUCCEEDED,
  caseDetails
});

export const openEditAllegationForm = allegationId => ({
  type: EDIT_ALLEGATION_FORM_OPENED,
  allegationId
});

export const closeEditAllegationForm = allegationId => {
  return {
    type: EDIT_ALLEGATION_FORM_CLOSED,
    allegationId
  };
};

export const clearEditAllegationFormData = () => ({
  type: EDIT_ALLEGATION_FORM_DATA_CLEARED
});

export const openRemoveOfficerAllegationDialog = allegation => ({
  type: REMOVE_ALLEGATION_DIALOG_OPENED,
  allegation
});

export const closeRemoveOfficerAllegationDialog = () => ({
  type: REMOVE_ALLEGATION_DIALOG_CLOSED
});

export const removeOfficerAllegationFailure = () => ({
  type: REMOVE_OFFICER_ALLEGATION_FAILED
});

export const removeOfficerAllegationSuccess = caseDetails => ({
  type: REMOVE_OFFICER_ALLEGATION_SUCCEEDED,
  caseDetails
});
