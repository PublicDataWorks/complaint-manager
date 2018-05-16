import React from "react";
import { Typography } from "material-ui";

const CivilianInfoDisplay = props => (
  <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }}>
    <Typography variant="caption" data-test={`${props.testLabel}Label`}>
      {props.displayLabel}
    </Typography>
    <Typography
      variant="body1"
      data-test={props.testLabel}
      style={{ whiteSpace: "pre-wrap" }}
    >
      {props.value ? props.value : "N/A"}
    </Typography>
  </div>
);

export default CivilianInfoDisplay;
