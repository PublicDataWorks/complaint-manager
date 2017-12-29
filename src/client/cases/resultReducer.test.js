import resultReducer from './resultReducer'

describe('resultReducer', function () {
  test('state should default to null if undefined', () =>{
    const newState = resultReducer(undefined, {type: 'BLAH'})
    expect(newState).toEqual(null);

  })

  test('Successful case creation should result in success message and type', () => {
    const action = {
      type: 'CASE_CREATED_SUCCESS',
      caseDetails:{
        id: 1234
      }
    }

    const newState = resultReducer(null, action)

    expect(newState).toEqual({
      message: 'Case 1234 was successfully created',
      type: 'SUCCESS'
    })
  })

  test('should be null when case creation is requested', () => {
    const action = {
      type: 'CASE_CREATION_REQUESTED',
    }

    const newState = resultReducer({type: 'SUCCESS', message: 'THis is a successful message'}, action)

    expect(newState).toEqual(null)
  })

  test('failed case creation should result in error message and type', () => {
    const action = {
      type: 'CASE_CREATION_FAILED',
      error: 500
    }

    const newState = resultReducer(null, action)

    expect(newState).toEqual({
      message: '500 Internal Server Error: Case not saved. Please try again.',
      type: 'FAILED'
    })
  })
});