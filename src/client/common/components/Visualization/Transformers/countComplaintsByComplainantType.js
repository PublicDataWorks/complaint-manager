import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";
import { sortRawDataDict } from "../helpers/sortRawDataDict";

export function transformData(rawData) {
  let labels, values, i;
  let count = 0;

  const countComplainantTypes = rawData => {
    let complainantTypeCountDictionary = {};

    rawData.forEach(element => {
      if (
        complainantTypeCountDictionary.hasOwnProperty(element.complainantType)
      ) {
        complainantTypeCountDictionary[element.complainantType]++;
      } else {
        complainantTypeCountDictionary[element.complainantType] = 1;
      }
    });

    return complainantTypeCountDictionary;
  };

  const complaintsByComplainantType = countComplainantTypes(rawData);

  let complaintsByComplainantTypeArray = Object.keys(
    complaintsByComplainantType
  ).map(key => {
    return [key, complaintsByComplainantType[key]];
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
    data: {
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
    },
    layout
  };
}
