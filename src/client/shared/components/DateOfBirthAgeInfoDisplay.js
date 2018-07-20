import React from "react";
import { Typography } from "@material-ui/core";

const DateOfBirthAgeInfoDisplay = props => {
  return (
    <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }}>
      <Typography variant="caption" data-test={`${props.testLabel}Label`}>
        {props.displayLabel}
      </Typography>
      <Typography data-test={props.testLabel}>
        {props.age === null ? "N/A" : `${props.birthDate} (${props.age})`}
      </Typography>
    </div>
  );
};

export default DateOfBirthAgeInfoDisplay;
