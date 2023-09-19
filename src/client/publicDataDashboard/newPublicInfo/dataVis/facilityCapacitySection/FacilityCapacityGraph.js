import React from "react";
import dataVisStyles from "../dataVisStyles";
import { withStyles } from "@material-ui/core";
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
      type: "bar"
    }
  ];

  const layout = {
    yaxis: {
      tickvals: ["50%", "100%", "150%"],
      ticktext: ["50%", "100%", "150%"],
      range: [0, 151]
    }
  };

  return <Plot data-testid="facility-graph" data={data} layout={layout} />;
};

export default withStyles(dataVisStyles)(FacilityCapacityGraph);
