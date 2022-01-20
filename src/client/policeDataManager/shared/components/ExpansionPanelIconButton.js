import { Icon, IconButton } from "@material-ui/core";
import React from "react";

const ExpansionPanelIconButton = ({ disabled }) => (
  <div style={{ width: "36px", marginRight: 16 }}>
    <Icon
      color="secondary"
      className="chevron-right"
      title="expansion-button"
      style={{ height: "36px", width: "36px" }}
      disabled={disabled}
    >
      unfold_more
    </Icon>
  </div>
);

export default ExpansionPanelIconButton;
