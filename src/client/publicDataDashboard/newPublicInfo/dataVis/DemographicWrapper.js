import React from "react";
import RadialChart from "./RadialChart";
import RadialChartInfo from "./RadialChartInfo";
import dataVisStyles from "./dataVisStyles";
import { withStyles } from "@material-ui/styles";

const DemographicWrapper = ({
  title,
  incPopProgress,
  statePopProgress,
  classes,
  screenSize
}) => {
  return (
    <div
      className={`${classes.demographicWrapper} ${
        classes[`demographicWrapper-${screenSize}`]
      }`}
    >
      <RadialChartInfo
        incPopProgress={incPopProgress}
        statePopProgress={statePopProgress}
      />
      <RadialChart
        title={title}
        incPopProgress={incPopProgress}
        statePopProgress={statePopProgress}
        dimension={200}
        radius={80}
        strokeWidth={20}
      />
    </div>
  );
};
export default withStyles(dataVisStyles)(DemographicWrapper);
