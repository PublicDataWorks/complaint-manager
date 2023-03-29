import { GET_PERSON_TYPES } from "../../../sharedUtilities/constants";
import personTypesReducer from "./personTypesReducer";

describe("personTypesReducer", () => {
  test("should default to empty array", () => {
    const newState = personTypesReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toStrictEqual([]);
  });

  test("should return the payload when action type is GET_SIGNERS", () => {
    expect(
      personTypesReducer([], { type: GET_PERSON_TYPES, payload: [1, 2, 3] })
    ).toEqual([1, 2, 3]);
  });
});
