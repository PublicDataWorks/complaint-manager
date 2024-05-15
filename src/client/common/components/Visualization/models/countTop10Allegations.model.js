import BarGraphVisualization from "./barGraphVisualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  PUBLIC_LABEL_FONT,
  COLORS
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";
import { truncateYValues } from "./countComplaintsByDistrict.model";
import { count } from "d3";

export default class CountTop10Allegations extends BarGraphVisualization {
  get queryType() {
    return QUERY_TYPES.COUNT_TOP_10_ALLEGATIONS;
  }

  get baseLayout() {
    return {
      barmode: "group",
      hovermode: "closest",
      hoverlabel: { bgcolor: "#FFF", align: "left" },
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
    let xValues = [];
    let yValues = [];
    let hoverValues = [];
    let CHAR_LIMIT = 115;

    rawData.reverse();

    const truncateValue = value => {
      if (value?.length > CHAR_LIMIT) {
        return value.substring(0, CHAR_LIMIT).concat("...");
      }
      return value;
    };

    // rawData.forEach(({ count, rule, directive, paragraph }) => {
    //   let directiveVal = directive ? directive : "";
    //   xValues.push(count);
    //   yValues.push(directive || rule + paragraph);
    //   hoverValues.push(paragraph + "<br>" + truncateValue(directiveVal));
    // });

    // let traces = rawData.map((item, index) => {
    //   let directiveVal = item.directive ? item.directive : "";
    //   let yValue = item.directive || item.rule + "<br>" + item.paragraph;
    //   let hoverValue = item.paragraph + "<br>" + truncateValue(directiveVal);

    //   return {
    //     x: [item.count],
    //     y: [yValue],
    //     type: "bar",
    //     width: 0.75,
    //     orientation: "h",
    //     marker: {
    //       color: COLORS[0],
    //       width: 1
    //     },
    //     textposition: "auto",
    //     textangle: 0,
    //     hovertext: [hoverValue],
    //     hoverinfo: "text"
    //   };
    // });
    let traces = [];

    rawData.forEach(item => {
      let directiveVal = item.directive ? item.directive : "";
      let yValue = item.directive || item.rule + "<br>" + item.paragraph;
      let hoverValue = item.paragraph + "<br>" + truncateValue(directiveVal);

      // Find an existing trace with the same rule and paragraph
      let existingTrace = traces.find(trace => trace.y[0] === yValue);

      if (existingTrace) {
        // If an existing trace is found, add the count to the existing trace
        existingTrace.x[0] += item.count;
      } else {
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
          hovertext: [hoverValue],
          hoverinfo: "text"
        });
      }
    });

    console.log("traces", traces);

    // let caseAllegationTrace = {

    //   x: xValues,
    //   y: truncatedYValues,
    //   type: "bar",
    //   width: 0.75,
    //   orientation: "h",
    //   marker: {
    //     color: COLORS[0]
    //   },
    //   text: xValues,
    //   textposition: "auto",
    //   textangle: 0,
    //   hovertext: hoverValues,
    //   hoverinfo: "text"
    // };
    // let getData = rawData.map(currentVal => {
    //   return {
    //     x: [currentVal.count],
    //     y: [[currentVal.rule || directive ]+ " " + currentVal.paragraph],
    //     orientation: 'h',
    //     name: 'test',
    //   }
    // })


    let truncatedYValues = truncateYValues(yValues);

    return {
      data: traces
    };
  }
}
