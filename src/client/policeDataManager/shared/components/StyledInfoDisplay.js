import React from "react";

const StyledInfoDisplay = props => (
  <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }}>
    {props.children}
  </div>
);

export default StyledInfoDisplay;
