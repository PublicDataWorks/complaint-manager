import React from "react";
import RadialChart from "./RadialChart";
import { demographicData } from "../dataVisData";
import dataVisStyles from "../dataVisStyles";
import { withStyles } from "@material-ui/core";
import { 
  Box,
  Typography
} from "@material-ui/core";
import { SCREEN_SIZES } from "../../../../../sharedUtilities/constants";
// pass screen size here and pass screen size texts to the children components. 

const DemographicSection = ({ classes, screenSize, data }) => { // name change dataVis container 
  return (
    <>
    <Box
          className={`${classes.graphInfoContainer} ${
            classes[`graphInfoContainer-${screenSize}`]
          }`}
        >
          <Typography
            variant="h3"
            className={`${classes.graphCategoryTitle} ${
              classes[`graphCategoryTitle-${screenSize}`]
            }`}
          >
            {data.title}
          </Typography>
          <Typography
            variant="body1"
            className={`${classes.graphCategoryDescription} ${
              classes[`graphCategoryDescription-${screenSize}`]
            }`}
          >
            {screenSize === SCREEN_SIZES.MOBILE ? data.mobile.description : data.notMobile.description}
          </Typography>
          <Box
            className={`${classes.graphWrapper} ${
              classes[`graphWrapper-${screenSize}`]
            }`}
          >
            {data.graph} // this is where we are left off - need to figure out how to pass in screenSizes
          </Box>
          <Typography
            variant="body1"
            className={`${classes.sourceText} ${
              classes[`sourceText-${screenSize}`]
            }`}
          >
            Source: Bureau of Justice Statistics, Federal Justice Statistics
            Program, 2021 (preliminary); US Census, 2022; and National Prisoner
            Statistics, 2021.
          </Typography>
        </Box>
      <DemographicGraph
        classes={classes}
        screenSize={screenSize}/>
      <Legend classes={classes} screenSize={screenSize}/>
    </>
  );
};

const DemographicGraph = ({ classes, screenSize }) => (
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
);

const Legend = ({ classes, screenSize }) => (
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
);

export default withStyles(dataVisStyles)(DemographicSection);
