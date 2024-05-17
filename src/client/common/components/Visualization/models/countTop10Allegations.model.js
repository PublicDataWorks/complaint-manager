import BarGraphVisualization from "./barGraphVisualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  PUBLIC_LABEL_FONT,
  COLORS
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";


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
        },
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
    rawData.reverse();
    let traces = [];
    if (rawData.length === 0) {
      traces.push({
        x: [],
        y: [],
        type: "bar",
        width: 0.75,
        orientation: "h",
        marker: {
          color: COLORS[0]
        },
        textposition: "auto",
        textangle: 0,
        hoverinfo: "none"
        });
      }    

    rawData.forEach(item => {
      let yValue = item.rule + "<br>" + item.paragraph;
      let existingTrace = traces.find(trace => trace.y[0] === yValue);
      if (existingTrace) {
        existingTrace.x[0] += item.count;
      } 
      else {
        // If no existing trace is found, create a new trace
        traces.push({
          x: [item.count],
          y: [yValue],
          type: "bar",
          width: 0.75,
          orientation: "h",
          marker: {
            color: COLORS[0],
          },
          textposition: "auto",
          textangle: 0,
          hoverinfo: "none"
        });
      }
    });

    return {
      data: traces
    };
  }
}
