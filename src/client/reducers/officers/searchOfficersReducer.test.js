import searchOfficersReducer from "./searchOfficersReducer";
import {searchOfficersSuccess} from "../../actionCreators/officersActionCreators";

describe('searchOfficersReducer', ()=>{
    test('should set state to new officer', ()=>{
        const initialState = {searchResults:[]}
        const searchResults = [{firstName: 'Bob'}]
        const newState = searchOfficersReducer(initialState, searchOfficersSuccess(searchResults))

        const expectedState = {searchResults:[{firstName: 'Bob'}]}
        expect(newState).toEqual(expectedState)
    })
})
