import { GET_PRIORITY_REASONS_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getPriorityReasonsSuccess = priorityReasons => ({
    type: GET_PRIORITY_REASONS_SUCCEEDED,
    priorityReasons
    });