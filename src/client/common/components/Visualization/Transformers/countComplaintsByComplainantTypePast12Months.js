import { COLORS, TITLE_FONT } from "../dataVizStyling";

export const enableDateHighlight = complainantTypeData => {
  const reversedComplainantType = [...complainantTypeData].reverse();

  return complainantTypeData
    .map(element => {
      return element["date"];
    })
    .concat(
      reversedComplainantType.map(element => {
        return element["date"];
      })
    );
};

export const enableCountHighlight = complainantTypeData => {
  const reversedComplainantType = [...complainantTypeData].reverse();

  return complainantTypeData
    .map(element => {
      return element["count"] + 0.5;
    })
    .concat(
      reversedComplainantType.map(element => {
        return element["count"] - 0.5;
      })
    );
};

export const transformData = rawData => {
  let maximum = 0;
  const determineMax = count => {
    if (count + 5 > maximum) {
      maximum = count + 5;
    }
  };

  const insertDateValues = complainantTypeData => {
    return complainantTypeData.map(date => {
      return date["date"];
    });
  };

  const insertCountValues = complainantTypeData => {
    return complainantTypeData.map(count => {
      determineMax(count["count"]);
      return count["count"];
    });
  };

  const highlightOptions = complainantType => {
    return {
      hoverinfo: "none",
      fill: "tozerox",
      line: { color: "transparent" },
      name: complainantType,
      showlegend: false,
      legendgroup: "group".concat(complainantType)
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

  let ccHighlight = {
    x: enableDateHighlight(rawData["CC"]),
    y: enableCountHighlight(rawData["CC"]),
    fillcolor: "rgba(0,33,113,0.2)",
    ...highlightOptions("CC")
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

  let poHighlight = {
    x: enableDateHighlight(rawData["PO"]),
    y: enableCountHighlight(rawData["PO"]),
    fillcolor: "rgba(95,173,86,0.3)",
    ...highlightOptions("PO")
  };

  let cnTrace = {
    x: insertDateValues(rawData["CN"]),
    y: insertCountValues(rawData["CN"]),
    name: "Civilian NOPD Employee (CN)",
    marker: {
      color: COLORS[2]
    },
    hoverinfo: "y+name",
    legendgroup: "groupCN"
  };

  let cnHighlight = {
    x: enableDateHighlight(rawData["CN"]),
    y: enableCountHighlight(rawData["CN"]),
    fillcolor: "rgba(157,93,155,0.3)",
    ...highlightOptions("CN")
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

  let acHighlight = {
    x: enableDateHighlight(rawData["AC"]),
    y: enableCountHighlight(rawData["AC"]),
    fillcolor: "rgba(230, 159, 1,0.3)",
    ...highlightOptions("AC")
  };

  const layout = {
    barmode: "group",
    yaxis: { range: [0, maximum] },
    font: {
      family: "Open Sans",
      color: "#A9A9A9",
      size: 14
    },
    title: {
      text: "Complainant Type over Past 12 Months",
      font: TITLE_FONT
    }
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
    { type: "scatter" }
  ];

  return {
    data: data,
    layout
  };
};
