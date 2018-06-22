import React from "react";
import { ExpansionPanelDetails } from "@material-ui/core";

const StyledExpansionPanelDetails = props => (
  <ExpansionPanelDetails
    style={{ padding: "8px 24px 24px 24px", marginLeft: "65px" }}
  >
    <div
      style={{
        display: "flex",
        width: "100%",
        background: "white",
        padding: "0",
        marginRight: "190px"
      }}
    >
      {props.children}
    </div>
  </ExpansionPanelDetails>
);

export default StyledExpansionPanelDetails;
