import Visualization from "./visualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  generateDonutCenterAnnotations,
  PUBLIC_LABEL_FONT,
  COLORS
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";
import { sum } from "lodash";
import { sortRawDataDict } from "../helpers/sortRawDataDict";

export default class CountComplaintsByIntakeSource extends Visualization {
  get queryType() {
    return QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE;
  }

  get baseLayout() {
    return {
      showlegend: false,
      font: LABEL_FONT,
      height: 600,
      width: 800,
      title: {
        text: "Intake Source",
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
      annotations: [generateDonutCenterAnnotations, "data.0.count"]
    };
  }

  transformData(rawData) {
    const labels = [];
    const values = [];

    const sortData = (intakeSourceA, intakeSourceB) => {
      return intakeSourceB.count - intakeSourceA.count;
    };

    const sortedData = sortRawDataDict(rawData, sortData);

    sortedData.forEach(element => {
      labels.push(element.name);
      values.push(Number(element.count));
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
