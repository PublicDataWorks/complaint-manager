import { get, isEmpty, merge } from 'lodash';
import { BAD_REQUEST_ERRORS } from '../../../../sharedUtilities/errorMessageConstants';
import { QUERY_TYPES } from '../../../../sharedUtilities/constants';
import {
  COLORS,
  LABEL_FONT,
  TITLE_FONT,
  generateDonutCenterAnnotations,
  generateNoTagsLayout,
  generateYAxisRange
} from "./dataVizStyling";

const FULL_LAYOUT = 'FULL_LAYOUT';

export const baseLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    showlegend: false,
    font: LABEL_FONT,
    height: 600,
    width: 800,
    title: {
      text: "Complaints by Intake Source",
      font: TITLE_FONT
    },
    margin: {
      b: 170
    }
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    showlegend: false,
    font: LABEL_FONT,
    height: 600,
    width: 800,
    title: {
      text: "Complaints by Complainant Type",
      font: TITLE_FONT
    },
    margin: {
      b: 170
    }
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
    barmode: "group",
    font: LABEL_FONT,
    title: {
      text: "Complainant Type over Past 12 Months",
      font: TITLE_FONT
    }
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
    barmode: "group",
    xaxis: {
      showgrid: false,
      zeroline: false,
      automargin: true,
      showticklabels: false
    },
    margin: {
      l: 235,
      r: 0,
      b: 70,
      t: 130,
      pad: 8
    },
    font: LABEL_FONT,
    title: {
      text: "Top Tags<br><sub>Past 12 Months",
      font: TITLE_FONT
    },
    width: 750
  }
};

export const extendedLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    height: 536,
    width: 806,
    title: null,
    margin: {
      b: 30,
      t: 30,
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
    margin: {
      b: 30,
      t: 30,
      l: 8,
      r: 8
    },
    paper_bgcolor: "#F5F4F4",
    plot_bgcolor: "#F5F4F4"
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
    title: null,
    width: 806,
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
    width: 806,
    margin: {
      b: 24,
      t: 24
    },
    paper_bgcolor: "#F5F4F4",
    plot_bgcolor: "#F5F4F4"
  }
};

export const dynamicLayoutProps = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    annotations: [generateDonutCenterAnnotations, 'data.0.count']
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    annotations: [generateDonutCenterAnnotations, 'data.0.count']
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
    [FULL_LAYOUT]: [generateNoTagsLayout, 'data.0.x.length', 'data.0.y.length']
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
    yaxis: [generateYAxisRange, 'data.8.maximum']
  }
};

export const getAggregateVisualizationLayout = ({ queryType = null, isPublic = false, newData = {} }) => {
  if (!queryType) {
    throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  }
  
  const currentBaseLayout = get(baseLayouts, queryType, {});
  const currentExtendedLayout = get(extendedLayouts, queryType, {});
  const currentDynamicLayout = get(dynamicLayoutProps, queryType, {});

  let aggregateLayout = currentBaseLayout;

  if (isPublic) {
    aggregateLayout = { ...aggregateLayout, ...currentExtendedLayout };
  }

  Object.keys(currentDynamicLayout).forEach(propName => {
    const [callback, ...params] = currentDynamicLayout[propName];
    
    const allValues = params.map(paramName => get(newData, paramName, null));

    if (propName === FULL_LAYOUT) {
      const extraProps = callback.apply(null, allValues);
      aggregateLayout = { ...aggregateLayout, ...extraProps };
    } else {
      const newValue = callback.apply(null, allValues);
      aggregateLayout[propName] = newValue;
    }
  });

  return aggregateLayout;
};


