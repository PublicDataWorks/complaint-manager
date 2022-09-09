import React from "react";
import { Typography } from "@material-ui/core";
import TextTruncate from "../../shared/components/TextTruncate";

const LetterTypeInfoDisplay = ({ displayLabel, value, testLabel }) => (
  <div>
    <Typography variant="caption" data-testid={`${testLabel}-label`}>
      {displayLabel}
    </Typography>
    <TextTruncate testLabel={testLabel} message={value ? value : "N/A"} />
  </div>
);

export default LetterTypeInfoDisplay;
