import React from "react";
import { Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import TextTruncate from "../../shared/components/TextTruncate";

const LetterTypeInfoDisplay = ({ displayLabel, value, testLabel }) => (
  <div>
    <Typography variant="caption" data-testid={`${testLabel}-label`}>
      {displayLabel}
    </Typography>
    {typeof value == "boolean" ? (
      value ? (
        <div>
          <CheckIcon />
        </div>
      ) : (
        <div>
          <CloseIcon />
        </div>
      )
    ) : (
      <TextTruncate testLabel={testLabel} message={value ? value : "N/A"} />
    )}
  </div>
);

export default LetterTypeInfoDisplay;
