import React from "react";
import { colors } from "../../publicInfoStyles";
import Plot from "react-plotly.js";
import { SCREEN_SIZES } from "../../../../../sharedUtilities/constants";
import GraphLegend from "../GraphLegend";
import { facilityGraphData, getCapacityPercentages } from "../dataVisData";

const FacilityCapacityGraph = ({ classes, screenSize }) => {
  const facilityNames = Object.keys(facilityGraphData).map(
    key => facilityGraphData[key].facilityName
  );

  const data = [
    {
      x: Object.keys(facilityGraphData),
      y: getCapacityPercentages()[0],
      type: "bar",
      customdata: facilityNames,
      hovertemplate: "%{customdata}<br>Occupancy Rate: %{y:.0f}%",
      marker: {
        color: colors.primaryBrand
      },
      name: ""
    },
    {
      x: Object.keys(facilityGraphData),
      y: getCapacityPercentages()[1],
      type: "bar",
      customdata: facilityNames,
      hovertemplate: "%{customdata}<br>Occupancy Rate: %{y:.0f}%",
      marker: {
        color: colors.secondaryBrand
      },
      name: ""
    }
  ];

  const getBarGraphWidth = () => {
    if (screenSize === SCREEN_SIZES.DESKTOP) {
      return 850;
    } else if (screenSize === SCREEN_SIZES.TABLET) {
      return 700;
    } else {
      return 350;
    }
  };

  const layout = {
    width: getBarGraphWidth(),
    margin: { l: 40, r: 40, t: 40, b: 40 },
    yaxis: {
      tickvals: ["50%", "100%", "150%", "200%", "250%"],
      ticktext: ["50%", "100%", "150%", "200%", "250%"],
      range: [0, 270],
      gridcolor: "lightgray",
      fixedrange: true
    },
    xaxis: {
      fixedrange: true
    },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    zoom: false,
    dragmode: false,
    bargroupgap: 0.1,
    showlegend: false
  };

  return (
    <>
      <div className={classes.facilityGraph} data-testid="facility-graph">
        <Plot
          data={data}
          layout={layout}
          config={{ displayModeBar: false, scrollZoom: true }}
        />
      </div>
      <GraphLegend
        classes={classes}
        screenSize={screenSize}
        first="Main Facility Occupancy Rate"
        second="Furlough Occupancy Rate"
      />
    </>
  );
};

export default FacilityCapacityGraph;
