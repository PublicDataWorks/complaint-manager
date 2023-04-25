import { getPersonType } from "./getPersonType";

describe("getPersonType", () => {
  test("should return primaryComplainant.personTypeDetails if it exists", () => {
    expect(
      getPersonType(
        { personTypeDetails: { dummy: "object" } },
        { default: "object" }
      )
    ).toEqual({
      dummy: "object"
    });
  });

  test("should return default person type if primaryComplainant does not have personTypeDetails", () => {
    expect(getPersonType({}, { default: "object" })).toEqual({
      default: "object"
    });
  });

  test("should return default person type if primaryComplainant does not exist", () => {
    expect(getPersonType(undefined, { default: "object" })).toEqual({
      default: "object"
    });
  });
});
