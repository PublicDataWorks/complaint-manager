export const getPersonType = (primaryComplainant, defaultPersonType) => {
  return primaryComplainant?.personTypeDetails ?? defaultPersonType;
};
