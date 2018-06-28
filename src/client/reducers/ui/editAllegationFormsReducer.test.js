import editAllegationFormsReducer from "./editAllegationFormsReducer";
import {
  clearEditAllegationFormData,
  closeEditAllegationForm,
  openEditAllegationForm
} from "../../actionCreators/allegationsActionCreators";

describe("editAllegationFormsReducer", () => {
  let initialState = {} ;

  test("should set default state", () => {
    const actualState = editAllegationFormsReducer(undefined, {type:"MOCK_ACTION"})

    expect(actualState).toEqual(initialState)
  });

  test("should set an allegation form to edit mode when EDIT_ALLEGATION_FORM", () => {
    initialState = { 1: { editMode: true }};
    const actualState = editAllegationFormsReducer(initialState, openEditAllegationForm(0));

    expect(actualState).toEqual({ 0: { editMode: true }, 1: { editMode: true }});
  })

  test("should clear out edit allegation form data", () => {
    initialState = {
      1: { editMode: true },
      2: { editMode: true },
      3: { editMode: true },
    };
    const actualState = editAllegationFormsReducer(initialState, clearEditAllegationFormData());

    expect(actualState).toEqual({});
  })

  test("should set an allegation form to edit mode false", () => {
    initialState = {
      1: { editMode: true },
      2: { editMode: true }
    };
    const actualState = editAllegationFormsReducer(initialState, closeEditAllegationForm(1));

    expect(actualState).toEqual({1: { editMode: false }, 2: { editMode: true }});
  })
});
