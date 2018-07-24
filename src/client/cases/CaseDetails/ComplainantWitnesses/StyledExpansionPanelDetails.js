import React from "react";
import { ExpansionPanelDetails } from "@material-ui/core";

const StyledExpansionPanelDetails = ({ children, style }) => (
  <ExpansionPanelDetails
    style={{ padding: "8px 24px 24px 24px", marginLeft: "64px", ...style }}
  >
    <div
      style={{
        display: "flex",
        width: "100%",
        background: "white",
        padding: "0",
        marginRight: "170px"
      }}
    >
      {children}
    </div>
  </ExpansionPanelDetails>
);

export default StyledExpansionPanelDetails;
