import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";
import { sortRawDataDict } from "../helpers/sortRawDataDict";

export function transformData(rawData, isPublic = false) {
  let labels, values;
  let count = 0;

  const caseReferenceToName = {
    CC: "Civilian (CC)",
    PO: "Police Officer (PO)",
    CN: "Civilian NOPD Employee (CN)",
    AC: "Anonymous (AC)"
  };

  let complaintsByComplainantTypeArray = Object.keys(rawData)
    .filter(key => {
      return rawData[key] > 0;
    })
    .map(key => {
      return [caseReferenceToName[key], rawData[key]];
    });

  const sortData = (complainantTypeA, complainantTypeB) => {
    return complainantTypeB[1] - complainantTypeA[1];
  };

  const sortedData = sortRawDataDict(
    complaintsByComplainantTypeArray,
    sortData
  );

  labels = sortedData.map(element => {
    return element[0];
  });

  values = sortedData.map(element => {
    return element[1];
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
      text: "Complaints by Complainant Type",
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
