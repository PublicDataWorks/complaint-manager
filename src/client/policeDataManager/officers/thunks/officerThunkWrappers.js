import editCaseOfficer from "./editCaseOfficer";
import addOfficer from "./addOfficer";

export const addThunkWrapper =
  (caseId, pd) => (officerId, caseEmployeeType) => values => {
    return addOfficer(caseId, officerId, caseEmployeeType, values, pd);
  };

export const editThunkWrapper =
  (caseId, caseOfficerId) => (officerId, caseEmployeeType) => values => {
    return editCaseOfficer(
      caseId,
      caseOfficerId,
      officerId,
      caseEmployeeType,
      values
    );
  };
