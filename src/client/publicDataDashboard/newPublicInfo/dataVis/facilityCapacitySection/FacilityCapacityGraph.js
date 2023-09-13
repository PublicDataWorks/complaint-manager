import React from "react";
import dataVisStyles from "../dataVisStyles";
import { withStyles } from "@material-ui/core";
import Plot from "react-plotly.js";

const FacilityCapacityGraph = ({ classes, screenSize }) => {
    const data = [
      {
        x: ['Apples', 'Oranges', 'Bananas'],
        y: [3, 2, 4],
        type: 'bar'
      }
    ];
  
    const layout = {
      title: 'Fruit Sales',
      xaxis: { title: 'Fruit' },
      yaxis: { title: 'Number of Sales' }
    };
  
    return <Plot data={data} layout={layout} />;
  };

export default withStyles(dataVisStyles)(FacilityCapacityGraph);
