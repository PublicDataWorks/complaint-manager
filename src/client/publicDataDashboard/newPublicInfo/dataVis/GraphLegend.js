import React from "react";

const GraphLegend = ({ classes, screenSize, first, second, opacity }) => (
  <div
    className={`${classes.demographicLegend} ${
      classes[`demographicLegend-${screenSize}`]
    }`}
  >
    <div style={{ display: "flex", alignItems: "center", padding: "2px 0" }}>
      <svg height="20" width="20">
        <circle cx="10" cy="10" r="8" fill="#0A3449" opacity={opacity || 1} />
      </svg>
      <span style={{ fontSize: "large", marginLeft: "10px" }}>{first}</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", padding: "2px 0" }}>
      <svg height="20" width="20">
        <circle cx="10" cy="10" r="8" fill="#22767C" opacity={opacity || 1} />
      </svg>
      <span style={{ fontSize: "large", marginLeft: "10px" }}>{second}</span>
    </div>
  </div>
);

export default GraphLegend;
