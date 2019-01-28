import React from "react";
import { Typography } from "@material-ui/core";

const OfficerNameDisplay = props => {
  return (
    <div>
      <Typography variant="caption">{props.displayLabel}</Typography>
      <Typography
        variant="body1"
        style={{ whiteSpace: "pre-wrap" }}
        data-test={`${props.displayLabel}FullName`}
      >
        {props.fullName ? props.fullName : "N/A"}
      </Typography>
      <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
        {props.windowsUsername ? `#${props.windowsUsername}` : "N/A"}
      </Typography>
    </div>
  );
};

export default OfficerNameDisplay;
