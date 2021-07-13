import { COLORS } from "../dataVizStyling";
import { sortRawDataDict } from "../helpers/sortRawDataDict";
import { sum } from "lodash";
import { PD } from "../../../../../instance-files/constants"

export function transformData(rawData) {
  let labels = [];
  let values = [];
  let count = 0;

  const caseReferenceToName = {
    CC: "Civilian (CC)",
    PO: "Police Officer (PO)",
    CN: `Civilian ${PD} Employee (CN)`,
    AC: "Anonymous (AC)"
  };

  let complaintsByComplainantTypeArray = Object.keys(rawData).reduce(
    (newArray, key) => {
      const currentValue = rawData[key];
      if (currentValue > 0) {
        const newTuple = [caseReferenceToName[key], currentValue];
        newArray.push(newTuple);
      }
      return newArray;
    },
    []
  );

  const sortData = (complainantTypeA, complainantTypeB) => {
    return complainantTypeB[1] - complainantTypeA[1];
  };

  const sortedData = sortRawDataDict(
    complaintsByComplainantTypeArray,
    sortData
  );

  sortedData.forEach(([label, value]) => {
    labels.push(label);
    values.push(value);
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
