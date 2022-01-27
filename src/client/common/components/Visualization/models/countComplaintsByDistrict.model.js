import Visualization from "./visualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  generateNoTagsLayout,
  PUBLIC_LABEL_FONT
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";

export default class CountComplaintsByDistrict extends Visualization {
  get queryType() {
    return QUERY_TYPES.COUNT_COMPLAINTS_BY_DISTRICT;
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
        text: "District",
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
        generateNoTagsLayout,
        "data.0.x.length",
        "data.0.y.length"
      ]
    };
  }
}
