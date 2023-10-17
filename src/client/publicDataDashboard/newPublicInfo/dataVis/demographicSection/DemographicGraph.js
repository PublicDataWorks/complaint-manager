import React from "react";
import { withStyles } from "@material-ui/core";
import dataVisStyles from "../dataVisStyles";
import RadialChart from "./RadialChart";
import { demographicData } from "../dataVisData";
import GraphLegend from "../GraphLegend";

const DemographicGraph = ({ classes, screenSize }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          height: "fit-content",
          marginTop: "40px"
        }}
      >
        {demographicData.map(demographic => (
          <div
            className={`${classes.radialChartWrapper} ${
              classes[`radialChartWrapper-${screenSize}`]
            }`}
            key={demographic.title}
          >
            <RadialChart
              title={demographic.title}
              innerPercentage={demographic.statePopulation}
              outerPercentage={demographic.incarceratedPopulation}
              dimension={200}
              radius={80}
              strokeWidth={20}
            />
          </div>
        ))}
      </div>
      <div className={classes["pi-text"]}>
        <p>*PI = Pacific Islanders</p>
      </div>
      <GraphLegend
        classes={classes}
        screenSize={screenSize}
        first="State Population"
        second="Incarcerated Population"
      />
    </>
  );
};

export default withStyles(dataVisStyles)(DemographicGraph);
