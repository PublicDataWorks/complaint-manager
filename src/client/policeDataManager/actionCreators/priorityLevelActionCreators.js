import { GET_PRIORITY_LEVEL_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getPriorityLevelSuccess = priorityLevels => ({
  type: GET_PRIORITY_LEVEL_SUCCEEDED,
  priorityLevels
});
