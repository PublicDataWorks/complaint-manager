import React from "react";
import { Typography } from "@material-ui/core";
import TextTruncate from "../../../shared/components/TextTruncate";

const CivilianInfoDisplay = props => (
  <div>
    <Typography variant="caption" data-testid={`${props.testLabel}Label`}>
      {props.displayLabel}
    </Typography>
    <TextTruncate
      testLabel={props.testLabel}
      message={props.value ? props.value : "N/A"}
    />
  </div>
);

export default CivilianInfoDisplay;
