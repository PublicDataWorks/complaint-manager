import { Box, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import dataVisStyles from "./dataVisStyles";
import DemographicGraph from "./demographicSection/DemographicGraph";
import FacilityCapacityGraph from "./facilityCapacitySection/FacilityCapacityGraph";

const DataVisContainer = ({ classes, screenSize, graphInfo, category }) => {
  const renderGraphScreenshots = () => {
    return screenSize === SCREEN_SIZES.MOBILE
      ? graphInfo.mobile.image && (
          <img
            width="100%"
            src={graphInfo.mobile.image}
            alt={`${category} mobile graph`}
          />
        )
      : graphInfo.notMobile.image && (
          <img
            width="75%"
            src={graphInfo.notMobile.image}
            alt={`${category} graph`}
          />
        );
  };

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
          {graphInfo.title}
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.graphCategoryDescription} ${
            classes[`graphCategoryDescription-${screenSize}`]
          }`}
        >
          {screenSize === SCREEN_SIZES.MOBILE
            ? graphInfo.mobile.description
            : graphInfo.notMobile.description}
        </Typography>
        <Box>
          {category === "Demographics" && (
            <DemographicGraph classes={classes} screenSize={screenSize} />
          )}
          {category === "Facility Overcrowding Rates" && (
            <FacilityCapacityGraph classes={classes} screenSize={screenSize} />
          )}
          {renderGraphScreenshots()}
        </Box>
        <Typography
          variant="body1"
          className={`${classes.sourceText} ${
            classes[`sourceText-${screenSize}`]
          }`}
        >
          {graphInfo.source}
        </Typography>
      </Box>
    </>
  );
};

export default withStyles(dataVisStyles)(DataVisContainer);
