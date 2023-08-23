import React from "react";
import RadialChart from "./RadialChart";
import RadialChartInfo from "./RadialChartInfo";
import dataVisStyles from "./dataVisStyles";
import { withStyles } from "@material-ui/styles";

const DemographicWrapper = ({
  title,
  outerProgress,
  innerProgress,
  classes,
  screenSize
}) => {
  return (
    <div
      className={`${classes.demographicWrapper} ${
        classes[`demographicWrapper-${screenSize}`]
      }`}
    >
      <RadialChartInfo />
      <RadialChart
        title={title}
        outerProgress={outerProgress}
        innerProgress={innerProgress}
        dimension={200}
        radius={80}
        strokeWidth={20}
      />
    </div>
  );
};
export default withStyles(dataVisStyles)(DemographicWrapper);
