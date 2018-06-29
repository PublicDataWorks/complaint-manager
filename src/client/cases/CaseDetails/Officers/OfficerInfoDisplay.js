import React from "react";
import { Typography } from "@material-ui/core";
import TextTruncate from "../../../shared/components/TextTruncate";

const OfficerInfoDisplay = ({
  testLabel,
  shouldTruncate = true,
  value,
  displayLabel,
  style
}) => (
  <div style={{ flex: 1, textAlign: "left", marginRight: "16px", ...style }}>
    <Typography variant="caption" data-test={`${testLabel}Label`}>
      {displayLabel}
    </Typography>
    {shouldTruncate ? (
      <TextTruncate testLabel={testLabel} message={value ? value : "N/A"} />
    ) : (
      <Typography
        variant="body1"
        data-test={testLabel}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {value ? value : "N/A"}
      </Typography>
    )}
  </div>
);

export default OfficerInfoDisplay;
