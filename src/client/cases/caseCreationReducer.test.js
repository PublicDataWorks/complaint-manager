import {createCaseSuccess, requestCaseCreation} from "./actionCreators";
import caseCreationReducer from "./caseCreationReducer";

describe('caseCreationReducer', function () {
  test('state should be false by default', () => {
    const newState = caseCreationReducer(undefined, {type: 'SOME_ACTION'})
    expect(newState).toEqual(false)
  })

  test('CASE_CREATED_SUCCESS', () => {
    const action = createCaseSuccess('case details');

    const newState = caseCreationReducer(true , action)

    expect(newState).toEqual(false)
  })

  test('CASE_CREATION_REQUESTED', () => {
    const action = requestCaseCreation();
    const newState = caseCreationReducer(false, action)
    expect(newState).toEqual(true)
  })

});