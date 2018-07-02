import removeOfficerAllegationDialogReducer from "./removeOfficerAllegationDialogReducer";
import {
  closeRemoveOfficerAllegationDialog,
  openRemoveOfficerAllegationDialog,
  removeOfficerAllegationSuccess
} from "../../actionCreators/allegationsActionCreators";

describe("remove officer allegation reducer dialog", () => {
  test("should set default state", () => {
    const initialState = { open: false, allegation: {} };

    const newState = removeOfficerAllegationDialogReducer(undefined, {
      type: "SOME_ACTION"
    });

    expect(newState).toEqual(initialState);
  });

  test("should set open state & populate allegation when open action dispatched", () => {
    const allegation = { some: "allegation data" };
    const action = openRemoveOfficerAllegationDialog(allegation);
    const initialState = { open: false, allegation: {} };

    const newState = removeOfficerAllegationDialogReducer(initialState, action);
    const expectedState = { open: true, allegation: allegation };

    expect(newState).toEqual(expectedState);
  });

  test("should set open state & populate allegation when close action dispatched", () => {
    const allegation = { some: "allegation data" };
    const action = closeRemoveOfficerAllegationDialog();
    const initialState = { open: true, allegation: allegation };

    const newState = removeOfficerAllegationDialogReducer(initialState, action);
    const expectedState = { open: false, allegation: {} };

    expect(newState).toEqual(expectedState);
  });

  test("should set open state & populate allegation when successful removal action dispatched", () => {
    const action = removeOfficerAllegationSuccess();
    const initialState = { open: true, allegation: { some: "allegation" } };

    const newState = removeOfficerAllegationDialogReducer(initialState, action);
    const expectedState = { open: false, allegation: {} };

    expect(newState).toEqual(expectedState);
  });
});
