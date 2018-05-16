import {GET_CASE_HISTORY_SUCCESS} from "../../sharedUtilities/constants";

export const getCaseHistorySuccess = (caseHistory) => ({
    type: GET_CASE_HISTORY_SUCCESS,
    caseHistory
});