import {
  ADD_OFFICER_TO_CASE_FAILED,
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  CASE_OFFICER_SELECTED,
  CLEAR_SELECTED_OFFICER,
  EDIT_CASE_OFFICER_FAILED,
  EDIT_CASE_OFFICER_SUCCEEDED,
  OFFICER_SELECTED,
  UNKNOWN_OFFICER_SELECTED
} from "../../sharedUtilities/constants";

export const addOfficerToCaseSuccess = caseDetails => ({
  type: ADD_OFFICER_TO_CASE_SUCCEEDED,
  caseDetails
});

export const addOfficerToCaseFailure = () => ({
  type: ADD_OFFICER_TO_CASE_FAILED
});

export const selectOfficer = officer => ({
  type: OFFICER_SELECTED,
  officer
});

export const selectCaseOfficer = caseOfficer => ({
  type: CASE_OFFICER_SELECTED,
  caseOfficer
});

export const clearSelectedOfficer = () => ({
  type: CLEAR_SELECTED_OFFICER
});

export const selectUnknownOfficer = () => ({
  type: UNKNOWN_OFFICER_SELECTED
});

export const editCaseOfficerSuccess = caseDetails => ({
  type: EDIT_CASE_OFFICER_SUCCEEDED,
  caseDetails
});

export const editCaseOfficerFailure = () => ({
  type: EDIT_CASE_OFFICER_FAILED
});
