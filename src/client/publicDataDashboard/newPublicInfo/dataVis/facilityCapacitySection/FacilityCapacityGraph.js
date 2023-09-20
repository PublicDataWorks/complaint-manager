import React from "react";
import { colors } from "../../publicInfoStyles";
import Plot from "react-plotly.js";
import { SCREEN_SIZES } from "../../../../../sharedUtilities/constants";
import GraphLegend from "../GraphLegend";

const FacilityCapacityGraph = ({ classes, screenSize }) => {
  const data = [
    {
      x: ["HCCC", "MCCC", "OCCC", "KCCC", "WCCC", "WCF", "KCF", "HCF"],
      y: [
        (272 / 126) * 100,
        (278 / 296) * 100,
        (994 / 778) * 100,
        (137 / 128) * 100,
        (182 / 240) * 100,
        (165 / 334) * 100,
        (95 / 160) * 100,
        (879 / 1124) * 100
      ],
      type: "bar",
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
          width: 2,
          opacity: 0.5
        }
      }
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
    dragmode: "orbit",
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
