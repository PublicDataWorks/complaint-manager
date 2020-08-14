import { sortRawDataDict } from "../helpers/sortRawDataDict";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

export function transformData(rawData) {
  let labels, values;
  let count = 0;

  const sortData = (intakeSourceA, intakeSourceB) => {
    return intakeSourceB.count - intakeSourceA.count;
  };

  const sortedData = sortRawDataDict(rawData, sortData);

  labels = sortedData.map(element => {
    return element.name;
  });

  values = sortedData.map(element => {
    return parseInt(element.count);
  });

  values.map(element => {
    return (count += element);
  });

  const layout = {
    title: {
      text: "Complaints by Intake Source",
      font: TITLE_FONT
    },
    height: 600,
    width: 800,
    margin: {
      b: 170
    },
    annotations: generateDonutCenterAnnotations(count),
    showlegend: false,
    font: LABEL_FONT
  };

  return {
    data: [
      {
        type: "pie",
        labels: labels,
        values: values,
        marker: {
          colors: COLORS
        },
        hoverinfo: "label+percent",
        textinfo: "label+value",
        textposition: "outside",
        hole: 0.5
      }
    ],
    layout
  };
}
