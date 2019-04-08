export const expectError = (testedFunction, expectedError) => {
  let error = "No error thrown";
  try {
    testedFunction();
  } catch (e) {
    error = e;
  } finally {
    expect(error).toEqual(expectedError);
  }
};
