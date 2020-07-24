import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";
import { sortRawDataDict } from "../helpers/sortRawDataDict";

export function transformData(rawData) {
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
    title: {
      text: "Complaints by Complainant Type",
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
