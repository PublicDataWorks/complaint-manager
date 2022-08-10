import canBeAnonymous from "../helpers/canBeAnonymous";
import { ACCUSED, WITNESS } from "../../../../sharedUtilities/constants";

describe("canBeAnonymous", () => {
  test("should return isAnonymous when supplied", () => {
    expect(canBeAnonymous(true)).toBeTrue();
  });

  test("should return false when passed false", () => {
    expect(canBeAnonymous(false)).toBeFalse();
  });

  test("should return false when there is no argument supplied", () => {
    expect(canBeAnonymous(undefined)).toBeFalse();
  });

  test("should return false when officer is accused", () => {
    expect(canBeAnonymous(true, ACCUSED)).toBeFalse();
  });

  test("should return true when officer is not accused", () => {
    expect(canBeAnonymous(true, WITNESS)).toBeTrue();
  });
});
