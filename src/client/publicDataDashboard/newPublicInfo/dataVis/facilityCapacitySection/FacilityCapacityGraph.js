import React from "react";
import { colors } from "../../publicInfoStyles";
import Plot from "react-plotly.js";

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
          colors.secondaryBrand,
          colors.secondaryBrand,
          colors.secondaryBrand,
          colors.secondaryBrand,
          colors.primaryBrand,
          colors.primaryBrand,
          colors.primaryBrand,
          colors.primaryBrand
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

  const layout = {
    width: 1000,
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
    <div className={classes.facilityGraph} data-testid="facility-graph">
      <Plot data={data} layout={layout} config={{ displayModeBar: false }} />
    </div>
  );
};

export default FacilityCapacityGraph;
