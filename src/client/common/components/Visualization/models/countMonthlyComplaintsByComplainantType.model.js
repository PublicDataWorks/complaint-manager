import Visualization from "./visualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  generateYAxisRange,
  PUBLIC_LABEL_FONT
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";
import { COLORS } from "../dataVizStyling";

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

  transformData(rawData) {
    let maximum = 0;
    const determineMax = (count = 0) => {
      const newCount = Math.round((count + 0.5) * 1.1);
      if (newCount > maximum) {
        maximum = newCount;
      }
    };

    const insertDateValues = complainantTypeData =>
      complainantTypeData.map(date => date.date);

    const insertCountValues = complainantTypeData =>
      complainantTypeData.map(({ count }) => {
        determineMax(count);
        return count;
      });

    const highlightOptions = complainantType => {
      return {
        hoverinfo: "none",
        fill: "tozerox",
        line: { color: "transparent" },
        name: complainantType,
        showlegend: false,
        legendgroup: `group${complainantType}`
      };
    };

    const mappedData = Object.keys(rawData).reduce((acc, key, idx) => {
      let trace = {
        x: insertDateValues(rawData[key]),
        y: insertCountValues(rawData[key]),
        name: key,
        marker: {
          color: COLORS[idx % COLORS.length]
        },
        hoverinfo: "y+name",
        legendgroup: "group" + key
      };

      let highlight = {
        x: enableDateHighlight(rawData[key]),
        y: enableCountHighlight(rawData[key], maximum),
        fillcolor: "rgba(0,33,113,0.2)",
        ...highlightOptions(key)
      };

      return [...acc, trace, highlight];
    }, []);

    const data = [
      ...mappedData,
      {
        type: "scatter",
        maximum
      }
    ];

    return { data };
  }
}

export const enableDateHighlight = complainantTypeData => {
  const reversedComplainantType = [...complainantTypeData].reverse();

  return [...complainantTypeData, ...reversedComplainantType].map(
    element => element.date
  );
};

export const enableCountHighlight = (complainantTypeData, maximum) => {
  const reversedComplainantType = [...complainantTypeData].reverse();

  return complainantTypeData
    .map(element => {
      return element["count"] + maximum * 0.025;
    })
    .concat(
      reversedComplainantType.map(element => {
        return element["count"] - maximum * 0.025;
      })
    );
};
