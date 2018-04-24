import searchOfficersReducer from "./searchOfficersReducer";
import {
    clearSelectedOfficer,
    searchOfficersCleared,
    searchOfficersFailed, searchOfficersInitiated,
    searchOfficersSuccess, selectOfficer
} from "../../actionCreators/officersActionCreators";

describe('searchOfficersReducer', ()=>{
    describe("SEARCH_OFFICERS_SUCCESS", () => {
        test('sets state include search results and hide spinner', ()=>{
            const initialState = {searchResults:[], spinnerVisible: true};
            const searchResults = [{firstName: 'Bob'}];
            const newState = searchOfficersReducer(initialState, searchOfficersSuccess(searchResults));

            const expectedState = {searchResults:[{firstName: 'Bob'}], spinnerVisible: false, selectedOfficer: null};
            expect(newState).toEqual(expectedState);
        })
    })
    describe('SEARCH_OFFICERS_INITIATED', () => {
        test('clears previous officer search results and shows spinner', () => {
            const initialState = {searchResults: [{firstName: 'someone'}], spinnerVisible: false};
            const newState = searchOfficersReducer(initialState, searchOfficersInitiated());
            expect(newState).toEqual({searchResults: [], spinnerVisible: true, selectedOfficer: null});
        })
    })

    describe('SEARCH_OFFICERS_FAILED', () => {
        test('hide the spinner when search fails', () => {
            const initialState = {searchResults: [], spinnerVisible: true};
            const newState = searchOfficersReducer(initialState, searchOfficersFailed());
            expect(newState).toEqual({searchResults: [], spinnerVisible: false, selectedOfficer: null});
        })
    })

    describe('SEARCH_OFFICERS_CLEARED', () => {
        test('clear search results, hide spinner, and retain selected officer', () => {
            const officer = {firstName: 'selected', lastName: 'officer'};
            const initialState = {searchResults: [{firstName: 'someone'}], spinnerVisible: true, selectedOfficer: officer};
            const newState = searchOfficersReducer(initialState, searchOfficersCleared());
            expect(newState).toEqual({searchResults: [], spinnerVisible: false, selectedOfficer: officer});
        })
    })

    describe('OFFICER_SELECTED', () => {
        test('set selected officer', () => {
            const initialState = {searchResults: [{firstName: 'someone'}], spinnerVisible: false, selectedOfficer: {}};
            const officer = {firstName: 'selected', lastName: 'officer'};
            const newState = searchOfficersReducer(initialState, selectOfficer(officer));
            expect(newState).toEqual({searchResults: [{firstName: 'someone'}], spinnerVisible: false, selectedOfficer: officer});
        })
    })

    describe("CLEAR_SELECTED_OFFICER", () => {
        test('clear the selected officer', () => {
            const initialState = {searchResuts: [], spinnerVisible: false, selectedOfficer: {firstName: 'bob'}}
            const newState = searchOfficersReducer(initialState, clearSelectedOfficer());
            expect(newState).toEqual({searchResuts: [], spinnerVisible: false, selectedOfficer: null});
        });
    });
});
