import React from "react";
import { Typography } from "material-ui";

const OfficerNameDisplay = props => {
  return (
    <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }}>
      <Typography variant="caption">{props.displayLabel}</Typography>
      <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
        {props.fullName ? props.fullName : "N/A"}
      </Typography>
      <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
        {props.windowsUsername ? `#${props.windowsUsername}` : "N/A"}
      </Typography>
    </div>
  );
};

export default OfficerNameDisplay;
