export const getFullDistrictName = ordinalDistrict => {
  switch (ordinalDistrict) {
    case "1st District":
      return "First District";
    case "2nd District":
      return "Second District";
    case "3rd District":
      return "Third District";
    case "4th District":
      return "Fourth District";
    case "5th District":
      return "Fifth District";
    case "6th District":
      return "Sixth District";
    case "7th District":
      return "Seventh District";
    case "8th District":
      return "Eighth District";
    default:
      return null;
  }
};

export const getOrdinalDistrict = districtName => {
  switch (districtName) {
    case "First District":
      return "1st District";
    case "Second District":
      return "2nd District";
    case "Third District":
      return "3rd District";
    case "Fourth District":
      return "4th District";
    case "Fifth District":
      return "5th District";
    case "Sixth District":
      return "6th District";
    case "Seventh District":
      return "7th District";
    case "Eighth District":
      return "8th District";
    default:
      return null;
  }
};
