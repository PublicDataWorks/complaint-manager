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

export const FULL_LAYOUT = "FULL_LAYOUT";

export const baseLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    showlegend: false,
    font: LABEL_FONT,
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
      pad: 10
    },
    paper_bgcolor: "#F5F4F4",
    plot_bgcolor: "#F5F4F4"
  }
};

export const mobileLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    margin: {
      b: 125,
      t: 125,
      l: 20,
      r: 20
    },
    font: { ...PUBLIC_LABEL_FONT, size: 10 }
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    margin: {
      b: 125,
      t: 125,
      l: 20,
      r: 20
    },
    font: { ...PUBLIC_LABEL_FONT, size: 10 }
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
