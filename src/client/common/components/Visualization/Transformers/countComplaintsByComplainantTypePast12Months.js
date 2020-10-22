import { COLORS, LABEL_FONT, TITLE_FONT } from "../dataVizStyling";
import _ from "lodash";

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

export const transformData = (rawData, isPublic = false) => {
  let maximum = 0;
  const determineMax = count => {
    const newCount = _.round((count + 0.5) * 1.1);
    if (newCount > maximum) {
      maximum = newCount;
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
    name: "Civilian NOPD Employee (CN)",
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

  const layout = {
    barmode: "group",
    yaxis: { range: [0, maximum] },
    font: LABEL_FONT
  };

  let extendedProps = {
    title: {
      text: "Complainant Type over Past 12 Months",
      font: TITLE_FONT
    }
  };

  if (isPublic) {
    extendedProps.title = null;
    extendedProps.width = 806;
    extendedProps.plot_bgcolor = "#F5F4F4";
    extendedProps.legend = {
      x: 0,
      y: -0.5
    };
    extendedProps.margin = {
      l: 24,
      r: 0,
      t: 8,
      b: 0
    };
  }

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
    layout: { ...layout, ...extendedProps }
  };
};
