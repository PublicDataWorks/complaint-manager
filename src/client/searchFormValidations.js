export const fieldTooShort = value => {
  const minLength = 2;
  return !!value && value.trim().length < minLength;
};

export const includesInvalidCharacter = value => {
  return value && (value.includes("%") || value.includes("_"));
};
