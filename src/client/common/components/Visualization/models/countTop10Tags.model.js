import BarGraphVisualization from "./barGraphVisualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  PUBLIC_LABEL_FONT,
  COLORS
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";
import { truncateYValues } from "./countComplaintsByDistrict.model";

export default class CountTop10Tags extends BarGraphVisualization {
  get queryType() {
    return QUERY_TYPES.COUNT_TOP_10_TAGS;
  }

  get baseLayout() {
    return {
      height: 600,
      width: 800,
      barmode: "group",
      hovermode: "closest",
      dragmode: false,
      xaxis: {
        showgrid: false,
        zeroline: false,
        automargin: true,
        tickangle: 0,
        showticklabels: true
      },
      margin: {
        l: 145,
        r: 0,
        b: 70,
        t: 130,
        pad: 10
      },
      font: LABEL_FONT, // font size is set to a fixed number
      title: {
        text: "Top Tags",
        font: TITLE_FONT
      }
    };
  }

  get extendedLayout() {
    return {
      title: null,
      font: PUBLIC_LABEL_FONT,
      margin: {
        b: 24,
        t: 24,
        l: 145,
        r: 15,
        pad: 10
      },
      paper_bgcolor: "#F5F4F4",
      plot_bgcolor: "#F5F4F4"
    };
  }

  get mobileLayout() {
    return {
      height: 500,
      width: 600,
      font: { ...PUBLIC_LABEL_FONT, size: 10 }
    };
  }

  get layoutProps() {
    return {
      ["FULL_LAYOUT"]: [
        this.generateEmptyLayout,
        "data.0.x.length",
        "data.0.y.length"
      ]
    };
  }

  get visualizationConfig() {
    return {
      responsive: true,
      useResizeHandler: true
    };
  }

  get dataProps() {
    return this.rawData.map(item => ({
      x: addLineBreaks(item.tag),
      y: item.count,
      type: "bar"
    }));
  }

  transformData(rawData) {
    const traceData = (xValue = undefined, yValue = undefined) => {
      return {
        x: xValue ? [xValue] : [],
        y: yValue ? [yValue] : [],
        type: "bar",
        width: 0.75,
        orientation: "h",
        marker: {
          color: COLORS[0]
        },
        textposition: "auto",
        textangle: 0
      };
    };
    rawData.reverse();
    const traces = [];
    if (rawData.length === 0) {
      traces.push(traceData());
    }

    rawData.forEach(item => {
      let name = item.name;
      let formattedName = "";

      while (name.length > 0) {
        if (name.length > 14) {
          let spaceIndex = name.lastIndexOf(" ", 14);
          if (spaceIndex === -1) spaceIndex = 14;
          formattedName += name.substring(0, spaceIndex) + "<br>";
          name = name.substring(spaceIndex).trim();
        } else {
          formattedName += name;
          name = "";
        }
      }

      traces.push(traceData(item.count, formattedName));
    });

    return {
      data: traces
    };
  }
}
