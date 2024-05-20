import BarGraphVisualization from "./barGraphVisualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  PUBLIC_LABEL_FONT,
  COLORS
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";
import { truncateYValues } from "./countComplaintsByDistrict.model";

export default class CountTop10Allegations extends BarGraphVisualization {
  get queryType() {
    return QUERY_TYPES.COUNT_TOP_10_ALLEGATIONS;
  }

  get baseLayout() {
    return {
      barmode: "group",
      dragmode: false,
      showlegend: false,
      xaxis: {
        title: "Number of Allegations",
        showgrid: true,
        zeroline: true,
        automargin: true,
        showticklabels: true,
        dtick: 1
      },
      yaxis: {
        title: {
          text: "Allegations",
          standoff: 30
        },
        tickfont: {
          size: 10
        }
      },
      margin: {
        l: 300,
        r: 0,
        b: 70,
        t: 130,
        pad: 10
      },
      font: LABEL_FONT,
      title: {
        text: "Top Allegations",
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
        (xValues, yValues) =>
          this.generateEmptyLayout(xValues, yValues, "Allegations"),
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
        textangle: 0,
        hoverinfo: "none"
      };
    };
    rawData.reverse();
    const traces = [];
    if (rawData.length === 0) {
      traces.push(traceData());
    }

    rawData.forEach(item => {
      const truncatedParagraph =
        item.paragraph.length > 40
          ? item.paragraph.substring(0, 40) + "..."
          : item.paragraph;
      const yValue = item.rule + "<br>" + truncatedParagraph;
      traces.push(traceData(item.count, yValue));
    });

    return {
      data: traces
    };
  }
}
