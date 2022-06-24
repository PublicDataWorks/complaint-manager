import { Typography } from "@material-ui/core";
import React from "react";
import StyledInfoDisplay from "../StyledInfoDisplay";
import TextTruncate from "../TextTruncate";

const DetailsCardDisplay = ({ caption, message, children }) => (
  <StyledInfoDisplay>
    <Typography variant="caption">{caption}</Typography>
    {message ? <TextTruncate message={message} /> : ""}
    {children ? children : ""}
  </StyledInfoDisplay>
);

export default DetailsCardDisplay;
