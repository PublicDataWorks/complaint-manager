import React from "react";
import { Typography } from "@material-ui/core";
import TextTruncate from "../../../../shared/components/TextTruncate";

const OfficerInfoDisplay = ({
  testLabel,
  shouldTruncate = true,
  value,
  displayLabel,
  style
}) => (
  <div style={{ margin: "5px" }}>
    <Typography variant="caption" data-testid={`${testLabel}Label`}>
      {displayLabel}
    </Typography>
    {shouldTruncate ? (
      <TextTruncate testLabel={testLabel} message={value ? value : "N/A"} />
    ) : (
      <Typography
        variant="body2"
        data-testid={testLabel}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {value ? value : "N/A"}
      </Typography>
    )}
  </div>
);

export default OfficerInfoDisplay;
