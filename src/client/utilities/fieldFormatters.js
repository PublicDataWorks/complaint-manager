export const trimWhitespace = fieldValue => {
  if (!fieldValue) {
    return "";
  }
  return typeof fieldValue === "string" ? fieldValue.trim() : fieldValue;
};
