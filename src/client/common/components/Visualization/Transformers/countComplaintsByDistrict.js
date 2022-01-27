import { COLORS } from "../dataVizStyling";
import { TAG_LABEL_CHAR_LIMIT } from "../../../../../sharedUtilities/constants";

export const truncateYValues = values => {
  // TODO extract to parent class
  return values.map(value => {
    if (value.length > TAG_LABEL_CHAR_LIMIT) {
      return value.substring(0, TAG_LABEL_CHAR_LIMIT).concat("...");
    }
    return value;
  });
};

export const transformData = rawData => {
  let xValues = [];
  let yValues = [];

  rawData.reverse();

  rawData.forEach(({ count, district }) => {
    xValues.push(count);
    yValues.push(district);
  });

  let truncatedYValues = truncateYValues(yValues);

  let districtTrace = {
    x: xValues,
    y: truncatedYValues,
    type: "bar",
    width: 0.75,
    orientation: "h",
    marker: {
      color: COLORS[0]
    },
    text: xValues,
    textposition: "auto",
    textangle: 0,
    hovertext: yValues,
    hoverinfo: "text"
  };

  return {
    data: [districtTrace]
  };
};
