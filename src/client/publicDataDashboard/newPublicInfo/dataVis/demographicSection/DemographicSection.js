import React from "react";
import RadialChart from "./RadialChart";
import { demographicData } from "../dataVisData";
import dataVisStyles from "../dataVisStyles";
import { withStyles } from "@material-ui/core";

const DemographicSection = ({ classes, screenSize }) => {
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
      <div
        className={`${classes.demographicLegend} ${
          classes[`demographicLegend-${screenSize}`]
        }`}
      >
        <div
          style={{ display: "flex", alignItems: "center", padding: "2px 0" }}
        >
          <svg height="20" width="20">
            <circle cx="10" cy="10" r="8" fill="#0A3449" />
          </svg>
          <span style={{ fontSize: "large", marginLeft: "10px" }}>
            State Population
          </span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", padding: "2px 0" }}
        >
          <svg height="20" width="20">
            <circle cx="10" cy="10" r="8" fill="#22767C" />
          </svg>
          <span style={{ fontSize: "large", marginLeft: "10px" }}>
            Incarcerated Population
          </span>
        </div>
      </div>
    </>
  );
};

export default withStyles(dataVisStyles)(DemographicSection);
