import { Divider } from "@material-ui/core";
import React from "react";
const RadialChartInfo = () => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ marginRight: "10px", maxWidth: "60px", textAlign: "right" }}
      >
        25% <br /> of state pop.
      </div>
      <Divider orientation="vertical" flexItem></Divider>
      <div style={{ marginLeft: "10px", maxWidth: "50px" }}>
        22% <br /> of inc. pop.
      </div>
    </div>
  );
};
export default RadialChartInfo;
