import { Divider } from "@material-ui/core";
import { ProfileMappingSource } from "@okta/okta-sdk-nodejs";
import React from "react";
const RadialChartInfo = ({ incPopProgress, statePopProgress }) => {
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
        {statePopProgress}% <br /> of state pop.
      </div>
      <Divider
        orientation="vertical"
        style={{ background: "#000", height: "85px" }}
        flexItem
      ></Divider>
      <div style={{ marginLeft: "10px", maxWidth: "50px" }}>
        {incPopProgress}% <br /> of inc. pop.
      </div>
    </div>
  );
};
export default RadialChartInfo;
