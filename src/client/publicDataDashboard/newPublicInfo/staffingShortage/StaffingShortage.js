import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import { colors, Typography } from "@material-ui/core";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const StaffingShortage = props => {
  return (
    <section className={props.classes.staffingShortageContainer}>
      <Typography
        variant="h2"
        className={props.classes.h2}
        style={{ marginBottom: "0px" }}
      >
        Staffing Shortage
      </Typography>
      <Typography
        variant="h2"
        className={`${props.classes.h2} ${props.classes.staffingShortageSubHeader}`}
      >
        Overall Impression
      </Typography>
      <div
        className={props.classes[`staffingShortageGrid-${props.screenSize}`]}
      >
        <Typography
          className={props.classes.textCard}
          style={{ border: "blue 2pt solid" }}
        >
          Serious overcrowding attributing to inhumane conditions, specifically
          for jails.
        </Typography>
        <Typography style={{ border: "blue 2pt solid" }}>
          <span>93%</span> Prisons Are Above Capacity
        </Typography>
        <img
          style={{ width: "100%" }}
          src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
        />
        <Typography style={{ border: "blue 2pt solid" }}>
          <span>156%</span> Jails Are Above Capacity
        </Typography>
        <Typography style={{ border: "blue 2pt solid" }}>
          Average rate across the country is 40-50%. Serious lack of movement
          and out-of-cell time for those in custody.
        </Typography>
        <Typography style={{ border: "blue 2pt solid" }}>
          <span>80%</span> Nearly 80% of People in Custody Are in Secure
          Settings
        </Typography>
        <img
          style={{ width: "100%" }}
          src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
        />
      </div>
    </section>
  );
};

export default withStyles(publicInfoStyles)(StaffingShortage);
