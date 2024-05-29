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
      height: 600,
      width: 800,
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
      height: 500,
      width: 600,
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
    const traces = [];

    const buildTraceData = (
      xValue = undefined,
      yValue = undefined,
      hoverText = undefined
    ) => {
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
        hoverinfo: hoverText ? "text" : "none",
        hovertext: hoverText ? [hoverText] : []
      };
    };

    rawData.reverse();

    if (rawData.length === 0) {
      traces.push(buildTraceData());
    }

    const buildYValue = (rule, originalParagraph) => {
      const CHARACTER_LIMIT = 40;
      const paragraph = originalParagraph.replace(/paragraph/gi, "PAR.");
      const paragraphToBeDisplayed =
        paragraph.length > CHARACTER_LIMIT
          ? paragraph.substring(0, CHARACTER_LIMIT) + "..."
          : paragraph;

      return rule + "<br>" + paragraphToBeDisplayed;
    };

    const buildHoverText = (rule, paragraph) => {
      let initialIndex = 0;
      let endIndex = 40;

      let hoverText = `${rule}<br>${paragraph.substring(
        initialIndex,
        endIndex
      )}`;
      while (paragraph.substring(endIndex).length > 0) {
        initialIndex = endIndex;
        endIndex += 40;
        hoverText += `<br>${paragraph.substring(initialIndex, endIndex)}`;
      }

      hoverText += paragraph.substring(endIndex);

      return hoverText;
    };

    rawData.forEach(item => {
      const yValue = buildYValue(item.rule, item.paragraph);
      const hoverText = buildHoverText(item.rule, item.paragraph);
      traces.push(buildTraceData(item.count, yValue, hoverText));
    });

    return {
      data: traces
    };
  }
}
