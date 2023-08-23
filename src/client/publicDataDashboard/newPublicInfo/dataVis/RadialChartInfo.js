import { Divider } from "@material-ui/core";
import React from "react";
const RadialChartInfo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "20px",
        width: "135px",
        alignItems: "center"
      }}
    >
      <div
        style={{ marginRight: "10px", maxWidth: "60px", textAlign: "right" }}
      >
        25% <br /> of state pop.
      </div>
      <Divider
        orientation="vertical"
        style={{ background: "#000", height: "85px" }}
        flexItem
      ></Divider>
      <div style={{ marginLeft: "10px", maxWidth: "50px" }}>
        22% <br /> of inc. pop.
      </div>
    </div>
  );
};
export default RadialChartInfo;
