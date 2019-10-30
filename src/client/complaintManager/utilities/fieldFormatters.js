export const trimWhitespace = fieldValue => {
  if (!fieldValue) {
    return "";
  }
  return typeof fieldValue === "string" ? fieldValue.trim() : fieldValue;
};

export const numbersOnly = fieldValue => {
  if (!fieldValue) {
    return "";
  }
  return typeof fieldValue === "string"
    ? fieldValue.replace(/[^0-9]/g, "")
    : fieldValue;
};
