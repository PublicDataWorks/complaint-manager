import React from "react";
import { Typography } from "@material-ui/core";

const OfficerNameDisplay = props => {
  return (
    <div>
      <Typography variant="caption">{props.displayLabel}</Typography>
      <Typography
        variant="body2"
        style={{ whiteSpace: "pre-wrap" }}
        data-testid={`${props.displayLabel}FullName`}
      >
        {props.fullName ? props.fullName : "N/A"}
      </Typography>
      <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
        {props.employeeId ? `#${props.employeeId}` : "N/A"}
      </Typography>
    </div>
  );
};

export default OfficerNameDisplay;
