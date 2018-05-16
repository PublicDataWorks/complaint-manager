import {GET_CASE_HISTORY_SUCCESS} from "../../../sharedUtilities/constants";
import caseHistoryReducer from "./caseHistoryReducer";
import {getCaseHistorySuccess} from "../../actionCreators/caseHistoryActionCreators";

describe("caseHistoryReducer", () => {
    describe("GET_CASE_HISTORY_SUCCESS", () => {
        test("it updates the case history", () => {
            const newCaseHistory = [{action: 'updated', user: 'someone', details: {}}];
            const newState = caseHistoryReducer([], getCaseHistorySuccess(newCaseHistory));
            expect(newState).toEqual(newCaseHistory);
        });
    });
});