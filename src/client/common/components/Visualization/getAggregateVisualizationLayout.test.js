import { get, set } from "lodash";

import {
  COLORS,
  LABEL_FONT,
  TITLE_FONT
} from "./dataVizStyling";
import {
  dynamicLayoutProps,
  evaluateDynamicProps,
  getAggregateVisualizationLayout
} from './getAggregateVisualizationLayout';
import {
  DATE_RANGE_TYPE,
  QUERY_TYPES
} from '../../../../sharedUtilities/constants';

const baseLayouts = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    showlegend: false,
    font: LABEL_FONT,
    height: 600,
    width: 800,
    title: {
      text: "Complaints by Intake Source<br><sub>Past 12 Months",
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
      text: "Complaints by Complainant Type<br><sub>Past 12 Months",
      font: TITLE_FONT
    },
    margin: {
      t: 160
    }
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]: {
    barmode: "group",
    font: LABEL_FONT,
    title: {
      text: "Complainant Type<br><sub>Past 12 Months",
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

const extendedLayouts = {
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

const allTestObjects = Object.values(QUERY_TYPES).reduce((testObjects, queryType) => {
  if (queryType === QUERY_TYPES.COUNT_COMPLAINT_TOTALS) return testObjects;
  
  const queryOptions = { dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS };
  const allProps = get(dynamicLayoutProps, queryType, []);

  const newData = Object.keys(allProps).reduce((newerData, propName) => {
    const randomNumber = Math.floor(Math.random() * 5);
    const allParams = get(allProps, propName, []).slice(1);
    allParams.forEach(paramName => set(newerData, paramName, randomNumber));
    return newerData;
  }, {});
  
  const testObject = { isPublic: true, queryType, queryOptions, newData };
  
  testObjects.push({ ...testObject });
  
  testObject.isPublic = false;
  testObjects.push(testObject);
  
  return testObjects;
}, []);

const runTestWithObject = ({ queryType, isPublic, queryOptions, newData }) => {
  const testDescription = `should provide the correct layout, given ${queryType} and the visualization ${isPublic ? 'is' : 'is not'} public`;
  test(testDescription, () => {
    const proposedLayout = getAggregateVisualizationLayout({
      queryType,
      isPublic,
      queryOptions,
      newData
    });
   
    let expectedLayout = { ...baseLayouts[queryType] };

    if (isPublic) {
      expectedLayout = { ...expectedLayout, ...extendedLayouts[queryType] };
    }

    const currentDynamicProps = get(dynamicLayoutProps, queryType, []);
    expectedLayout = {
      ...expectedLayout,
      ...evaluateDynamicProps(currentDynamicProps, newData)
    };
    
    expect(proposedLayout).toEqual(expectedLayout);
  });
};


describe("getAggregateVisualizationLayout", () => {
  allTestObjects.forEach(runTestWithObject);
});
      
