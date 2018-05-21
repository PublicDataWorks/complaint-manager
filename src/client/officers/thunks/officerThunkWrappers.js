import editCaseOfficer from "./editCaseOfficer";
import addOfficer from "./addOfficer";

export const addThunkWrapper = caseId => officerId => values => {
  return addOfficer(caseId, officerId, values);
};

export const editThunkWrapper = (
  caseId,
  caseOfficerId
) => officerId => values => {
  return editCaseOfficer(caseId, caseOfficerId, officerId, values);
};
