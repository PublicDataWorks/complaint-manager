import Visualization from "./visualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  generateYAxisRange,
  PUBLIC_LABEL_FONT
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";

export default class CountMonthlyComplaintsByComplainantType extends Visualization {
  get queryType() {
    return QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE;
  }

  get baseLayout() {
    return {
      barmode: "group",
      dragmode: false,
      font: LABEL_FONT,
      title: {
        text: "Complainant Type",
        font: TITLE_FONT
      }
    };
  }

  get extendedLayout() {
    return {
      width: 800,
      title: null,
      font: PUBLIC_LABEL_FONT,
      plot_bgcolor: "#F5F4F4",
      legend: {
        x: 0,
        y: -0.5
      },
      margin: {
        l: 24,
        r: 0,
        t: 8,
        b: 0
      }
    };
  }

  get layoutProps() {
    return {
      yaxis: [generateYAxisRange, "data.8.maximum"]
    };
  }
}
