import { GET_SIGNERS } from "../../../sharedUtilities/constants";
import signersReducer from "./signersReducer";

describe("signersReducer", () => {
  test("should default to empty array", () => {
    const newState = signersReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(newState).toStrictEqual([]);
  });

  test("should return the payload when action type is GET_SIGNERS", () => {
    expect(
      signersReducer([], { type: GET_SIGNERS, payload: [1, 2, 3] })
    ).toEqual([1, 2, 3]);
  });
});
