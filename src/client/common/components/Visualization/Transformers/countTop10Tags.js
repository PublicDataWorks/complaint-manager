import { COLORS, LABEL_FONT, TITLE_FONT } from "../dataVizStyling";

export const transformData = (rawData) => {
  let xValues = [];
  let yValues = [];

  rawData.reverse();

  rawData.forEach(({ count, name }) => {
    xValues.push(count);
    yValues.push(name);
  });

  let caseTagTrace = {
    x: xValues,
    y: yValues,
    type: "bar",
    width: 0.75,
    orientation: "h",
    marker: {
      color: COLORS[0]
    },
    text: xValues,
    textposition: "auto",
    textangle: 0,
    hoverinfo: "none"
  };

  return {
    data: [caseTagTrace],
  };
};
