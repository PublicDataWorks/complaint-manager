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
      barmode: "group",
      hovermode: "closest",
      dragmode: false,
      xaxis: {
        showgrid: false,
        zeroline: false,
        automargin: true,
        showticklabels: false
      },
      margin: {
        l: 145,
        r: 0,
        b: 70,
        t: 130,
        pad: 10
      },
      font: LABEL_FONT,
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

  transformData(rawData) {
    let xValues = [];
    let yValues = [];

    rawData.reverse();

    rawData.forEach(({ count, name }) => {
      xValues.push(count);
      yValues.push(name);
    });

    let truncatedYValues = truncateYValues(yValues);

    let caseTagTrace = {
      x: xValues,
      y: truncatedYValues,
      type: "bar",
      width: 0.75,
      orientation: "h",
      marker: {
        color: COLORS[0]
      },
      text: xValues,
      textposition: "auto",
      textangle: 0,
      hovertext: yValues,
      hoverinfo: "text"
    };

    return {
      data: [caseTagTrace]
    };
  }
}
