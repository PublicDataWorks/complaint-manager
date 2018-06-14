import React from "react";
import { Typography } from "@material-ui/core";
import TextTruncate from "../../../shared/components/TextTruncate";

const CivilianInfoDisplay = props => (
  <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }}>
    <Typography variant="caption" data-test={`${props.testLabel}Label`}>
      {props.displayLabel}
    </Typography>
    <TextTruncate
      testLabel={props.testLabel}
      message={props.value ? props.value : "N/A"}
    />
  </div>
);

export default CivilianInfoDisplay;
