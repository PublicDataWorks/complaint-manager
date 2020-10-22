import { sortRawDataDict } from "../helpers/sortRawDataDict";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

export function transformData(rawData, isPublic = false) {
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
    annotations: generateDonutCenterAnnotations(count),
    showlegend: false,
    font: LABEL_FONT
  };

  let extendedProps = {
    height: 600,
    width: 800,
    title: {
      text: "Complaints by Intake Source",
      font: TITLE_FONT
    },
    margin: {
      b: 170
    }
  };

  if (isPublic) {
    extendedProps.height = 536;
    extendedProps.width = 806;
    extendedProps.title = null;
    extendedProps.margin.b = 30;
    extendedProps.margin.t = 30;
    extendedProps.margin.l = 8;
    extendedProps.margin.r = 8;
    extendedProps.paper_bgcolor = "#F5F4F4";
    extendedProps.plot_bgcolor = "#F5F4F4";
  }

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
    layout: { ...layout, ...extendedProps }
  };
}
