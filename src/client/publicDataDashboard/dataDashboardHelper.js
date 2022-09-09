export const getIdFromDataSectionType = dataSectionType => {
  if (
    !dataSectionType?.queryType ||
    typeof dataSectionType.queryType !== "string"
  ) {
    return "cannot-convert-id";
  }
  return dataSectionType.queryType.toLowerCase().replace(/_/g, "-");
};
