import DonutVisualization from "./donutVisualization.model";
import { LABEL_FONT, TITLE_FONT, PUBLIC_LABEL_FONT } from "../dataVizStyling";
import { COLORS } from "../dataVizStyling";
import { sortRawDataDict } from "../helpers/sortRawDataDict";
import { sum } from "lodash";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";

export default class CountComplaintsByComplainantType extends DonutVisualization {
  get queryType() {
    return QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE;
  }

  get baseLayout() {
    return {
      showlegend: false,
      font: LABEL_FONT,
      height: 600,
      width: 800,
      title: {
        text: "Complainant Type",
        font: TITLE_FONT
      },
      margin: {
        t: 160
      }
    };
  }

  get extendedLayout() {
    return {
      height: 536,
      width: 806,
      title: null,
      font: PUBLIC_LABEL_FONT,
      margin: {
        b: 100,
        t: 100,
        l: 8,
        r: 8
      },
      paper_bgcolor: "#F5F4F4",
      plot_bgcolor: "#F5F4F4"
    };
  }

  get mobileLayout() {
    return {
      height: 500,
      width: 600,
      margin: {
        b: 125,
        t: 125,
        l: 20,
        r: 20
      },
      font: { ...PUBLIC_LABEL_FONT, size: 12 }
    };
  }

  get layoutProps() {
    return {
      annotations: [this.generateCenterAnnotations, "data.0.count"]
    };
  }

  get visualizationConfig() {
    return {
      responsive: false,
      useResizeHandler: false
    };
  }

  transformData(rawData) {
    let labels = [];
    let values = [];

    let complaintsByComplainantTypeArray = Object.keys(rawData).reduce(
      (newArray, key) => {
        const currentValue = rawData[key];
        if (currentValue > 0) {
          const newTuple = [key, currentValue];
          newArray.push(newTuple);
        }
        return newArray;
      },
      []
    );

    const sortedData = sortRawDataDict(
      complaintsByComplainantTypeArray,
      (complainantTypeA, complainantTypeB) => {
        return complainantTypeB[1] - complainantTypeA[1];
      }
    );

    sortedData.forEach(([label, value]) => {
      labels.push(label);
      values.push(value);
    });

    return {
      data: [
        {
          type: "pie",
          labels: labels,
          values: values,
          count: sum(values),
          marker: {
            colors: COLORS
          },
          hoverinfo: "label+percent",
          textinfo: "label+value",
          textposition: "outside",
          hole: 0.5
        }
      ]
    };
  }
}
