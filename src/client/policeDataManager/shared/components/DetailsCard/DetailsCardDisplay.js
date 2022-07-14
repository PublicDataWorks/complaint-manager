import { Typography } from "@material-ui/core";
import React from "react";
import TextTruncate from "../TextTruncate";

const DetailsCardDisplay = ({ caption, message, children, width }) => (
  <section
    style={{
      display: "flex",
      flexDirection: "column",
      marginRight: "10px",
      textAlign: "left",
      width
    }}
  >
    <Typography variant="caption">{caption}</Typography>
    {message ? <TextTruncate testLabel={caption} message={message} /> : ""}
    {children ? children : ""}
  </section>
);

export default DetailsCardDisplay;
