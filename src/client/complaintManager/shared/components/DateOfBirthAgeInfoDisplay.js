import React from "react";
import { Typography } from "@material-ui/core";

const DateOfBirthAgeInfoDisplay = props => {
  return (
    <div>
      <Typography variant="caption" data-test={`${props.testLabel}Label`}>
        {props.displayLabel}
      </Typography>
      <Typography data-test={props.testLabel}>
        {!props.birthDate ? "N/A" : `${props.birthDate} (${props.age})`}
      </Typography>
    </div>
  );
};

export default DateOfBirthAgeInfoDisplay;
