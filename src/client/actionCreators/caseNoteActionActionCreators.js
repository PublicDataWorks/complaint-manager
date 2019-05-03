import { GET_CASE_NOTE_ACTIONS_SUCCEEDED } from "../../sharedUtilities/constants";

export const getCaseNoteActionsSuccess = caseNoteActions => {
  return {
    type: GET_CASE_NOTE_ACTIONS_SUCCEEDED,
    caseNoteActions
  };
};
