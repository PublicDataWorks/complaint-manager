import React from "react";
import RadialChart from "./RadialChart";
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
      <RadialChart
        title={title}
        innerPopProgress={statePopProgress}
        outerPopProgress={incPopProgress}
        dimension={200}
        radius={80}
        strokeWidth={20}
      />
    </div>
  );
};
export default withStyles(dataVisStyles)(DemographicWrapper);
