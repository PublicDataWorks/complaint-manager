import { COLORS, LABEL_FONT, TITLE_FONT } from "../dataVizStyling";

export const transformData = rawData => {
  let xValues;
  let yValues;
  rawData.reverse();

  xValues = rawData.map(count => {
    return count["count"];
  });

  yValues = rawData.map(name => {
    return name["name"];
  });

  const noTags = xValues.length == 0 && yValues.length == 0;

  let caseTagTrace = {
    x: xValues,
    y: yValues,
    type: "bar",
    width: 0.75,
    orientation: "h",
    marker: {
      color: COLORS[0]
    },
    text: xValues,
    textposition: "auto",
    textangle: 0,
    hoverinfo: "none"
  };

  const layout = {
    barmode: "group",
    xaxis: {
      showgrid: false,
      zeroline: false,
      automargin: true,
      showticklabels: false
    },
    title: {
      text: "Top Tags<br><sub>Past 12 Months",
      font: TITLE_FONT
    },
    width: 750,
    margin: {
      l: 235,
      r: 0,
      b: 70,
      t: 130,
      pad: 8
    },
    font: LABEL_FONT
  };

  if (noTags) {
    layout["annotations"] = [
      {
        text: "No Tags to display",
        y: 1,
        showarrow: false,
        font: LABEL_FONT
      }
    ];
    layout["yaxis"] = {
      zeroline: false,
      showgrid: false,
      showticklabels: false
    };
    layout.xaxis.zeroline = true;
    layout.xaxis.showgrid = true;
    layout.margin.l = 0;
  }

  return {
    data: [caseTagTrace],
    layout
  };
};
