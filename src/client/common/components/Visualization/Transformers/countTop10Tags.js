import { COLORS } from "../dataVizStyling";

export const transformData = rawData => {
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
    hoverinfo: "y"
  };

  return {
    data: [caseTagTrace]
  };
};
