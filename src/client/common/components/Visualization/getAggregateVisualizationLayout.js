import { get, isEmpty } from "lodash";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import {
  DATE_RANGE_TYPE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import {
  LABEL_FONT,
  TITLE_FONT,
  generateDonutCenterAnnotations,
  generateNoTagsLayout,
  generateYAxisRange,
  PUBLIC_LABEL_FONT
} from "./dataVizStyling";
import district1 from "./layers/district1.json";
import district2 from "./layers/district2.json";
import district3 from "./layers/district3.json";
import district4 from "./layers/district4.json";
import district5 from "./layers/district5.json";
import district6 from "./layers/district6.json";
import district7 from "./layers/district7.json";
import district8 from "./layers/district8.json";
import districts from "./layers/NOPD_Police_Districts.json";

export const FULL_LAYOUT = "FULL_LAYOUT";

const districtArr = [
  { source: district1, color: "#F00", hovertext: "Police District 1" },
  { source: district2, color: "#0F0", hovertext: "Police District 2" },
  { source: district3, color: "#00F", hovertext: "Police District 3" },
  { source: district4, color: "#FF0", hovertext: "Police District 4" },
  { source: district5, color: "#F0F", hovertext: "Police District 5" },
  { source: district6, color: "#0FF", hovertext: "Police District 6" },
  { source: district7, color: "#000", hovertext: "Police District 7" },
  { source: district8, color: "#DDD", hovertext: "Police District 8" }
];

const districtCommon = {
  sourcetype: "geojson",
  type: "fill",
  opacity: 0.2
};

export const baseLayouts = {
  [QUERY_TYPES.LOCATION_DATA]: {
    dragmode: "zoom",
    mapbox: {
      style: "open-street-map",
      center: { lat: 29.947, lon: -90.07 },
      zoom: 10,
      layers: [
        {
          sourcetype: "geojson",
          source: districts,
          type: "line"
        },
        ...districtArr.map(district => ({ ...district, ...districtCommon }))
      ]
    },
    margin: { r: 0, t: 0, b: 0, l: 0 }
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
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
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
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
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
    barmode: "group",
    dragmode: false,
    font: LABEL_FONT,
    title: {
      text: "Complainant Type",
      font: TITLE_FONT
    }
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
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
  }
};

export const extendedLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
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
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
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
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
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
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
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
  }
};

export const mobileLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    height: 500,
    width: 600,
    margin: {
      b: 125,
      t: 125,
      l: 20,
      r: 20
    },
    font: { ...PUBLIC_LABEL_FONT, size: 12 }
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    height: 500,
    width: 600,
    margin: {
      b: 125,
      t: 125,
      l: 20,
      r: 20
    },
    font: { ...PUBLIC_LABEL_FONT, size: 12 }
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
    font: { ...PUBLIC_LABEL_FONT, size: 10 }
  }
};

export const dynamicLayoutProps = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    annotations: [generateDonutCenterAnnotations, "data.0.count"]
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    annotations: [generateDonutCenterAnnotations, "data.0.count"]
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
    [FULL_LAYOUT]: [generateNoTagsLayout, "data.0.x.length", "data.0.y.length"]
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
    yaxis: [generateYAxisRange, "data.8.maximum"]
  }
};

export const subtitles = {
  [DATE_RANGE_TYPE.PAST_12_MONTHS]: "Past 12 Months",
  [DATE_RANGE_TYPE.YTD]: "Year-to-Date"
};

export const evaluateDynamicProps = (currentDynamicProps, newData) => {
  let currentDynamicLayout = {};

  Object.keys(currentDynamicProps).forEach(propName => {
    const [callback, ...params] = currentDynamicProps[propName];

    const allValues = params.map(paramName => get(newData, paramName, null));
    const extraProps = callback.apply(null, allValues);

    if (propName === FULL_LAYOUT) {
      currentDynamicLayout = { ...currentDynamicLayout, ...extraProps };
    } else {
      currentDynamicLayout[propName] = extraProps;
    }
  });

  return currentDynamicLayout;
};

export const getAggregateVisualizationLayout = ({
  queryType = null,
  queryOptions = {},
  isPublic = false,
  isMobile = false,
  newData = {}
}) => {
  let aggregateLayout = get(baseLayouts, queryType, {});

  if (isEmpty(aggregateLayout)) {
    throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  }

  const currentExtendedLayout = get(extendedLayouts, queryType, {});
  const currentMobileLayout = get(mobileLayouts, queryType, {});

  if (isPublic) {
    aggregateLayout = { ...aggregateLayout, ...currentExtendedLayout };

    if (isMobile) {
      aggregateLayout = { ...aggregateLayout, ...currentMobileLayout };
    }
  }

  if (queryOptions.dateRangeType) {
    const currentTitle = get(aggregateLayout, ["title", "text"], "");
    const currentSubtitle = subtitles[queryOptions.dateRangeType] || "";
    const newSubtitle = [currentTitle, currentSubtitle].join("<br><sub>");

    if (currentTitle) {
      const title = {
        text: newSubtitle,
        font: TITLE_FONT
      };

      aggregateLayout = {
        ...aggregateLayout,
        ...{ title }
      };
    }
  }

  const currentDynamicProps = get(dynamicLayoutProps, queryType, {});
  return {
    ...aggregateLayout,
    ...evaluateDynamicProps(currentDynamicProps, newData)
  };
};
