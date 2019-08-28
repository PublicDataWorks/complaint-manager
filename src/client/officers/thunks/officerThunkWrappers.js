import editCaseOfficer from "./editCaseOfficer";
import addOfficer from "./addOfficer";

export const addThunkWrapper = caseId => (
  officerId,
  caseEmployeeType
) => values => {
  return addOfficer(caseId, officerId, caseEmployeeType, values);
};

export const editThunkWrapper = (caseId, caseOfficerId) => (
  officerId,
  caseEmployeeType
) => values => {
  return editCaseOfficer(
    caseId,
    caseOfficerId,
    officerId,
    caseEmployeeType,
    values
  );
};
