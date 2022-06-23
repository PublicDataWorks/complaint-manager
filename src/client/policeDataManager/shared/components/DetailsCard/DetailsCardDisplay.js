import { Typography } from "@material-ui/core";
import React from "react";
import StyledInfoDisplay from "../StyledInfoDisplay";
import TextTruncate from "../TextTruncate";

const DetailsCardDisplay = ({ caption, message }) => (
  <StyledInfoDisplay>
    <Typography variant="caption">{caption}</Typography>
    <TextTruncate message={message} />
  </StyledInfoDisplay>
);

export default DetailsCardDisplay;
