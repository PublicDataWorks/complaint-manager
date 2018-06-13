import createCaseDialogReducer from "./createCaseDialogReducer";
import {closeCreateCaseDialog, openCreateCaseDialog} from "../../actionCreators/casesActionCreators";

describe("createCaseDialogReducer", () => {
  test("should set initial state", () => {
    const expectedState = {
      open: false
    };

    const actualState = createCaseDialogReducer(undefined, {type: 'SOME_ACTION'})
    expect(actualState).toEqual(expectedState)
  });

  test('should open the dialog', ()=>{
    const initialState = {
      open: false
    }
    const expectedState = {
      open: true
    };

    const actualState = createCaseDialogReducer(initialState, openCreateCaseDialog())
    expect(actualState).toEqual(expectedState)
  })

  test('should close the dialog', ()=>{
    const initialState = {
      open: true
    }
    const expectedState = {
      open: false
    };

    const actualState = createCaseDialogReducer(initialState, closeCreateCaseDialog())
    expect(actualState).toEqual(expectedState)
  })
});
