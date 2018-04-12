import searchOfficersReducer from "./searchOfficersReducer";
import {
    searchOfficersFailed, searchOfficersInitiated,
    searchOfficersSuccess
} from "../../actionCreators/officersActionCreators";

describe('searchOfficersReducer', ()=>{
    describe("SEARCH_OFFICERS_SUCCESS", () => {
        test('sets state include search results and hide spinner', ()=>{
            const initialState = {searchResults:[], spinnerVisible: true};
            const searchResults = [{firstName: 'Bob'}];
            const newState = searchOfficersReducer(initialState, searchOfficersSuccess(searchResults));

            const expectedState = {searchResults:[{firstName: 'Bob'}], spinnerVisible: false};
            expect(newState).toEqual(expectedState);
        })
    })
    describe('SEARCH_OFFICERS_INITIATED', () => {
        test('clears previous officer search results and shows spinner', () => {
            const initialState = {searchResults: [{firstName: 'someone'}], spinnerVisible: false};
            const newState = searchOfficersReducer(initialState, searchOfficersInitiated());
            expect(newState).toEqual({searchResults: [], spinnerVisible: true});
        })
    })

    describe('SEARCH_OFFICERS_FAILED', () => {
        test('hide the spinner when search fails', () => {
            const initialState = {searchResults: [], spinnerVisible: true};
            const newState = searchOfficersReducer(initialState, searchOfficersFailed());
            expect(newState).toEqual({searchResults: [], spinnerVisible: false});
        })
    })
});
