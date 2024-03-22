import React from "react";

const StyledInfoDisplay = (props, gridColumn) => (
  <div
    style={{
      flex: 1,
      textAlign: "left",
      marginRight: "10px",
      gridColumn: gridColumn
    }}
  >
    {props.children}
  </div>
);

export default StyledInfoDisplay;
