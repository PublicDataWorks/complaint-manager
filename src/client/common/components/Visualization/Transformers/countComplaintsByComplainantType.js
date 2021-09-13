import { COLORS } from "../dataVizStyling";
import { sortRawDataDict } from "../helpers/sortRawDataDict";
import { sum } from "lodash";

const {
  PD,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export function transformData(rawData) {
  let labels = [];
  let values = [];
  let count = 0;

  const caseReferenceToName = {
    [PERSON_TYPE.CIVILIAN.abbreviation]:
      PERSON_TYPE.CIVILIAN.complainantLegendValue,
    [PERSON_TYPE.KNOWN_OFFICER.abbreviation]:
      PERSON_TYPE.KNOWN_OFFICER.complainantLegendValue,
    [PERSON_TYPE.CIVILIAN_WITHIN_PD
      .abbreviation]: `Civilian ${PD} Employee (${PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation})`,
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
