import shiftSingleElementOfArray from "./shiftSingleElementOfArray";

describe("shift single element of array", () => {
  let testArray;

  beforeEach(() => {
    testArray = ["blue", "yellow", "red", "green"];
  });

  test("should move element to desired position", () => {
    const desiredArray = ["blue", "red", "yellow", "green"];
    shiftSingleElementOfArray(testArray, "red", 1);

    expect(testArray).toEqual(desiredArray);
  });

  test("should not edit array if element not found", () => {
    const desiredArray = ["blue", "yellow", "red", "green"];
    shiftSingleElementOfArray(testArray, "purple", 1);

    expect(testArray).toEqual(desiredArray);
  });

  test("it should not edit array if finalDesiredIndex is out of bounds", () => {
    const desiredArray = ["blue", "yellow", "red", "green"];
    shiftSingleElementOfArray(testArray, "red", 4);

    expect(testArray).toEqual(desiredArray);
  });
});
