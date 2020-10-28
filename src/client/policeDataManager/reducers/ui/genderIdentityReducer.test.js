import { getGenderIdentitiesSuccess } from "../../actionCreators/genderIdentityActionCreators";
import genderIdentityReducer from "./genderIdentityReducer";

describe("genderIdentityReducer", () => {
  test("should initialize to blank array", () => {
    const newState = genderIdentityReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual([]);
  });

  test("should set given genderIdentities on state", () => {
    const genderIdentities = [
      ["Trans Female", 0],
      ["Trans Male", 1],
      ["Unknown", 2]
    ];

    const newState = genderIdentityReducer(
      undefined,
      getGenderIdentitiesSuccess(genderIdentities)
    );

    expect(newState).toEqual(genderIdentities);
  });
});
