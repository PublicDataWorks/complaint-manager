import {
  ADD_CASE_EMPLOYEE_TYPE,
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  CASE_OFFICER_SELECTED,
  CLEAR_CASE_EMPLOYEE_TYPE,
  CLEAR_SELECTED_OFFICER,
  EDIT_CASE_OFFICER_SUCCEEDED,
  OFFICER_SELECTED,
  UNKNOWN_OFFICER_SELECTED
} from "../../../sharedUtilities/constants";

export const addOfficerToCaseSuccess = caseDetails => ({
  type: ADD_OFFICER_TO_CASE_SUCCEEDED,
  caseDetails
});

export const addCaseEmployeeType = caseEmployeeType => ({
  type: ADD_CASE_EMPLOYEE_TYPE,
  caseEmployeeType
});

export const editCaseOfficerSuccess = () => ({
  type: EDIT_CASE_OFFICER_SUCCEEDED
});

export const clearCaseEmployeeType = () => ({
  type: CLEAR_CASE_EMPLOYEE_TYPE
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
