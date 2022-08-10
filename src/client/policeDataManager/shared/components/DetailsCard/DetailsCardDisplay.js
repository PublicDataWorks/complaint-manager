import { Typography } from "@material-ui/core";
import React from "react";
import TextTruncate from "../TextTruncate";

const DetailsCardDisplay = ({ caption, message, children, width }) => (
  <section
    style={{
      display: "flex",
      flexDirection: "column",
      //marginLeft: "20px",
      textAlign: "left",
      width: "25%",
    }}
  >
    <div style = {{marginLeft: '20px'}}>
    <Typography variant="caption">{caption}</Typography>
    {message ? <TextTruncate testLabel={caption} message={message} /> : ""}
    {children ? children : ""}
    </div>
  </section>
);

export default DetailsCardDisplay;
