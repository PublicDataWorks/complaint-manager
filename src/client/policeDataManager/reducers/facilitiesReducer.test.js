import { GET_FACILITIES } from "../../../sharedUtilities/constants";
import facilitiesReducer from "./facilitiesReducer";

describe("facilitiesReducer", () => {
  test("should default to empty array", () => {
    const newState = facilitiesReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toStrictEqual([]);
  });

  test("should return the payload when action type is GET_SIGNERS", () => {
    expect(
      facilitiesReducer([], { type: GET_FACILITIES, payload: [1, 2, 3] })
    ).toEqual([1, 2, 3]);
  });
});
