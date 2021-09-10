import { COLORS } from "../dataVizStyling";

const { PD, PERSON_TYPE } = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const enableDateHighlight = complainantTypeData => {
  const reversedComplainantType = [...complainantTypeData].reverse();

  return [...complainantTypeData, ...reversedComplainantType].map(
    element => element.date
  );
};

export const enableCountHighlight = (complainantTypeData, maximum) => {
  const reversedComplainantType = [...complainantTypeData].reverse();

  return complainantTypeData
    .map(element => {
      return element["count"] + maximum * 0.025;
    })
    .concat(
      reversedComplainantType.map(element => {
        return element["count"] - maximum * 0.025;
      })
    );
};

export const transformData = rawData => {
  let maximum = 0;
  const determineMax = (count = 0) => {
    const newCount = Math.round((count + 0.5) * 1.1);
    if (newCount > maximum) {
      maximum = newCount;
    }
  };

  const insertDateValues = complainantTypeData =>
    complainantTypeData.map(date => date.date);

  const insertCountValues = complainantTypeData =>
    complainantTypeData.map(({ count }) => {
      determineMax(count);
      return count;
    });

  const highlightOptions = complainantType => {
    return {
      hoverinfo: "none",
      fill: "tozerox",
      line: { color: "transparent" },
      name: complainantType,
      showlegend: false,
      legendgroup: `group${complainantType}`
    };
  };

  let ccTrace = {
    x: insertDateValues(rawData[PERSON_TYPE.CIVILIAN.abbreviation]),
    y: insertCountValues(rawData[PERSON_TYPE.CIVILIAN.abbreviation]),
    name: `Civilian (${PERSON_TYPE.CIVILIAN.abbreviation})`,
    marker: {
      color: COLORS[0]
    },
    hoverinfo: "y+name",
    legendgroup: "group" + PERSON_TYPE.CIVILIAN.abbreviation
  };

  let poTrace = {
    x: insertDateValues(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation]),
    y: insertCountValues(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation]),
    name: `Police Officer (${PERSON_TYPE.KNOWN_OFFICER.abbreviation})`,
    marker: {
      color: COLORS[1]
    },
    hoverinfo: "y+name",
    legendgroup: "group" + PERSON_TYPE.KNOWN_OFFICER.abbreviation
  };

  let cnTrace = {
    x: insertDateValues(rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]),
    y: insertCountValues(rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]),
    name: `Civilian ${PD} Employee (${PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation})`,
    marker: {
      color: COLORS[2]
    },
    hoverinfo: "y+name",
    legendgroup: "group" + PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation
  };

  let acTrace = {
    x: insertDateValues(rawData["AC"]),
    y: insertCountValues(rawData["AC"]),
    name: "Anonymous (AC)",
    marker: {
      color: COLORS[5]
    },
    hoverinfo: "y+name",
    legendgroup: "groupAC"
  };

  let ccHighlight = {
    x: enableDateHighlight(rawData[PERSON_TYPE.CIVILIAN.abbreviation]),
    y: enableCountHighlight(rawData[PERSON_TYPE.CIVILIAN.abbreviation], maximum),
    fillcolor: "rgba(0,33,113,0.2)",
    ...highlightOptions(PERSON_TYPE.CIVILIAN.abbreviation)
  };

  let poHighlight = {
    x: enableDateHighlight(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation]),
    y: enableCountHighlight(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation], maximum),
    fillcolor: "rgba(95,173,86,0.3)",
    ...highlightOptions(PERSON_TYPE.KNOWN_OFFICER.abbreviation)
  };

  let cnHighlight = {
    x: enableDateHighlight(rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]),
    y: enableCountHighlight(rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation], maximum),
    fillcolor: "rgba(157,93,155,0.3)",
    ...highlightOptions(PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation)
  };

  let acHighlight = {
    x: enableDateHighlight(rawData["AC"]),
    y: enableCountHighlight(rawData["AC"], maximum),
    fillcolor: "rgba(230, 159, 1,0.3)",
    ...highlightOptions("AC")
  };

  const data = [
    ccTrace,
    ccHighlight,
    poTrace,
    poHighlight,
    cnTrace,
    cnHighlight,
    acTrace,
    acHighlight,
    {
      type: "scatter",
      maximum
    }
  ];

  return { data };
};
