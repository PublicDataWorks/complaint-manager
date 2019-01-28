import { Icon, IconButton } from "@material-ui/core";
import React from "react";

const ExpansionPanelIconButton = ({ disabled }) => (
  <div style={{ width: "36px", marginRight: 16 }}>
    <IconButton
      color="secondary"
      className="chevron-right"
      style={{ height: "36px", width: "36px" }}
      disabled={disabled}
    >
      <Icon>unfold_more</Icon>
    </IconButton>
  </div>
);

export default ExpansionPanelIconButton;
