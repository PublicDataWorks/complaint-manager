import {
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  CASE_OFFICER_SELECTED,
  CLEAR_SELECTED_OFFICER,
  OFFICER_SELECTED,
  UNKNOWN_OFFICER_SELECTED
} from "../../sharedUtilities/constants";

export const addOfficerToCaseSuccess = caseDetails => ({
  type: ADD_OFFICER_TO_CASE_SUCCEEDED,
  caseDetails
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
