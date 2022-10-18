import {
  CLEAR_LETTER_TYPE_TO_EDIT,
  SET_LETTER_TYPE_TO_ADD
} from "../../../../sharedUtilities/constants";
import addLetterTypeReducer from "./addLetterTypeReducer";

describe("addLetterTypeReducer", () => {
  test("should default to empty object", () => {
    const newState = addLetterTypeReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toStrictEqual({});
  });

  test("should return payload if action type is SET_LETTER_TYPE_TO_ADD", () => {
    const payload = { data: "Yay!" };
    expect(
      addLetterTypeReducer({}, { type: SET_LETTER_TYPE_TO_ADD, payload })
    ).toEqual(payload);
  });

  test("should return empty object if action type is CLEAR_LETTER_TYPE_TO_EDIT", () => {
    expect(
      addLetterTypeReducer(
        { data: "Yay!" },
        { type: CLEAR_LETTER_TYPE_TO_EDIT }
      )
    ).toEqual({});
  });
});
