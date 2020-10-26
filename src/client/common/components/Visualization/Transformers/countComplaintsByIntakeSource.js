import { sum } from "lodash";
import { sortRawDataDict } from "../helpers/sortRawDataDict";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

export function transformData(rawData = {}) {
  const labels = [];
  const values = [];

  const sortData = (intakeSourceA, intakeSourceB) => {
    return intakeSourceB.count - intakeSourceA.count;
  };

  const sortedData = sortRawDataDict(rawData, sortData);

  sortedData.forEach(element => {
    labels.push(element.name);
    values.push(Number(element.count))
  });

  return {
    data: [
      {
        type: "pie",
        labels: labels,
        values: values,
        count: sum(values),
        marker: {
          colors: COLORS
        },
        hoverinfo: "label+percent",
        textinfo: "label+value",
        textposition: "outside",
        hole: 0.5
      }
    ]
  };
}
