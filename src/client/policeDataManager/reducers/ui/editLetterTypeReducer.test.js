import {
  CLEAR_LETTER_TYPE_TO_EDIT,
  SET_LETTER_TYPE_TO_EDIT
} from "../../../../sharedUtilities/constants";
import editLetterTypeReducer from "./editLetterTypeReducer";

describe("editLetterTypeReducer", () => {
  test("should default to empty object", () => {
    const newState = editLetterTypeReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toStrictEqual({});
  });

  test("should return payload if action type is SET_LETTER_TYPE_TO_EDIT", () => {
    const payload = { data: "Yay!" };
    expect(
      editLetterTypeReducer({}, { type: SET_LETTER_TYPE_TO_EDIT, payload })
    ).toEqual(payload);
  });

  test("should return empty object if action type is CLEAR_LETTER_TYPE_TO_EDIT", () => {
    expect(
      editLetterTypeReducer(
        { data: "Yay!" },
        { type: CLEAR_LETTER_TYPE_TO_EDIT }
      )
    ).toEqual({});
  });
});
