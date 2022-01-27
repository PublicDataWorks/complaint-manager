import Visualization from "./visualization.model";
import {
  LABEL_FONT,
  TITLE_FONT,
  generateYAxisRange,
  PUBLIC_LABEL_FONT
} from "../dataVizStyling";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";
import { COLORS } from "../dataVizStyling";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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

    let ccTrace = {
      x: insertDateValues(rawData[PERSON_TYPE.CIVILIAN.abbreviation]),
      y: insertCountValues(rawData[PERSON_TYPE.CIVILIAN.abbreviation]),
      name: PERSON_TYPE.CIVILIAN.publicLegendValue,
      marker: {
        color: COLORS[0]
      },
      hoverinfo: "y+name",
      legendgroup: "group" + PERSON_TYPE.CIVILIAN.abbreviation
    };

    let poTrace = {
      x: insertDateValues(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation]),
      y: insertCountValues(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation]),
      name: PERSON_TYPE.KNOWN_OFFICER.publicLegendValue,
      marker: {
        color: COLORS[1]
      },
      hoverinfo: "y+name",
      legendgroup: "group" + PERSON_TYPE.KNOWN_OFFICER.abbreviation
    };

    let cpdTrace = {
      x: insertDateValues(rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]),
      y: insertCountValues(
        rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]
      ),
      name: PERSON_TYPE.CIVILIAN_WITHIN_PD.publicLegendValue,
      marker: {
        color: COLORS[2]
      },
      hoverinfo: "y+name",
      legendgroup: "group" + PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation
    };

    let acTrace = {
      x: insertDateValues(rawData["AC"]),
      y: insertCountValues(rawData["AC"]),
      name: "Anonymous (AC)",
      marker: {
        color: COLORS[5]
      },
      hoverinfo: "y+name",
      legendgroup: "groupAC"
    };

    let ccHighlight = {
      x: enableDateHighlight(rawData[PERSON_TYPE.CIVILIAN.abbreviation]),
      y: enableCountHighlight(
        rawData[PERSON_TYPE.CIVILIAN.abbreviation],
        maximum
      ),
      fillcolor: "rgba(0,33,113,0.2)",
      ...highlightOptions(PERSON_TYPE.CIVILIAN.abbreviation)
    };

    let poHighlight = {
      x: enableDateHighlight(rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation]),
      y: enableCountHighlight(
        rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation],
        maximum
      ),
      fillcolor: "rgba(95,173,86,0.3)",
      ...highlightOptions(PERSON_TYPE.KNOWN_OFFICER.abbreviation)
    };

    let cpdHighlight = {
      x: enableDateHighlight(
        rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]
      ),
      y: enableCountHighlight(
        rawData[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation],
        maximum
      ),
      fillcolor: "rgba(157,93,155,0.3)",
      ...highlightOptions(PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation)
    };

    let acHighlight = {
      x: enableDateHighlight(rawData["AC"]),
      y: enableCountHighlight(rawData["AC"], maximum),
      fillcolor: "rgba(230, 159, 1,0.3)",
      ...highlightOptions("AC")
    };

    const data = [
      ccTrace,
      ccHighlight,
      poTrace,
      poHighlight,
      cpdTrace,
      cpdHighlight,
      acTrace,
      acHighlight,
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
