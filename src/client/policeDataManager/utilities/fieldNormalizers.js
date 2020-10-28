export const trimWhiteSpace = value => {
  return value && value.trim();
};

export const nullifyFieldUnlessValid = input => {
  const isWhiteSpace =
    input && typeof input !== "number" && input.trim() === "";
  return input === "" || isWhiteSpace ? null : input;
};
