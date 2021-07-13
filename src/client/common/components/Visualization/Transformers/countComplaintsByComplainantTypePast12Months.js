import { COLORS } from "../dataVizStyling";
import { PD } from "../../../../../instance-files/constants"

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
    x: insertDateValues(rawData["CC"]),
    y: insertCountValues(rawData["CC"]),
    name: "Civilian (CC)",
    marker: {
      color: COLORS[0]
    },
    hoverinfo: "y+name",
    legendgroup: "groupCC"
  };

  let poTrace = {
    x: insertDateValues(rawData["PO"]),
    y: insertCountValues(rawData["PO"]),
    name: "Police Officer (PO)",
    marker: {
      color: COLORS[1]
    },
    hoverinfo: "y+name",
    legendgroup: "groupPO"
  };

  let cnTrace = {
    x: insertDateValues(rawData["CN"]),
    y: insertCountValues(rawData["CN"]),
    name: `Civilian ${PD} Employee (CN)`,
    marker: {
      color: COLORS[2]
    },
    hoverinfo: "y+name",
    legendgroup: "groupCN"
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
    x: enableDateHighlight(rawData["CC"]),
    y: enableCountHighlight(rawData["CC"], maximum),
    fillcolor: "rgba(0,33,113,0.2)",
    ...highlightOptions("CC")
  };

  let poHighlight = {
    x: enableDateHighlight(rawData["PO"]),
    y: enableCountHighlight(rawData["PO"], maximum),
    fillcolor: "rgba(95,173,86,0.3)",
    ...highlightOptions("PO")
  };

  let cnHighlight = {
    x: enableDateHighlight(rawData["CN"]),
    y: enableCountHighlight(rawData["CN"], maximum),
    fillcolor: "rgba(157,93,155,0.3)",
    ...highlightOptions("CN")
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
