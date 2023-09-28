import React from "react";
import { colors } from "../../publicInfoStyles";
import Plot from "react-plotly.js";
import { SCREEN_SIZES } from "../../../../../sharedUtilities/constants";
import GraphLegend from "../GraphLegend";
import { facilityGraphData, getCapacityPercentages } from "../dataVisData";

const FacilityCapacityGraph = ({ classes, screenSize }) => {
  const data = [
    {
      x: Object.keys(facilityGraphData),
      y: getCapacityPercentages(),
      type: "bar",
      customdata: [
        ["Hawaii Community Correctional Center", 272],
        ["Maui Community Correctional Center", 278],
        ["Oahu Community Correctional Center", 994],
        ["Kauai Community Correctional Center", 137],
        ["Women's Community Correctional Center", 182],
        ["Walawa Correctional Facility", 165],
        ["Kulani Correctional Facility", 95],
        ["Halawa Correctional Facility", 879]
      ],
      hovertemplate:
        "%{customdata[0]}<br>Capacity: %{y:.0f}%<br>Population: %{customdata[1]}",
      marker: {
        width: 0.5,
        color: [
          colors.primaryBrand,
          colors.primaryBrand,
          colors.primaryBrand,
          colors.primaryBrand,
          colors.secondaryBrand,
          colors.secondaryBrand,
          colors.secondaryBrand,
          colors.secondaryBrand
        ],
        opacity: 0.5,
        line: {
          color: "black",
          width: 1.5
        }
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
      tickvals: ["50%", "100%", "150%"],
      ticktext: ["50%", "100%", "150%"],
      range: [0, 230],
      gridcolor: "lightgray"
    },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    zoom: false,
    dragmode: false,
    bargroupgap: 0.2
  };

  return (
    <>
      <div className={classes.facilityGraph} data-testid="facility-graph">
        <Plot data={data} layout={layout} config={{ displayModeBar: false }} />
      </div>
      <GraphLegend
        classes={classes}
        screenSize={screenSize}
        first="Jail"
        second="Prison"
        opacity={0.5}
      />
    </>
  );
};

export default FacilityCapacityGraph;
