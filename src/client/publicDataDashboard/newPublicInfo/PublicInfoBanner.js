import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import { Typography } from "@material-ui/core";

export const SUBTEXT =
  "New report finds those who are sentenced to less than one year typically have committed less severe crimes. The pre-sentenced population makes up 78% of all who are in jail.";
export const BUTTON_TEXT = "READ THE REPORT";
export const BUTTON_URL =
  "https://hcsoc.hawaii.gov/wp-content/uploads/2023/01/2022-HCSOC-Annual-Report-FINAL.pdf";

const PublicInfoBanner = props => {
  return (
    <section
      className={`${props.classes.banner} ${
        props.classes[`banner-${props.screenSize}`]
      }`}
    >
      <Typography
        className={`${props.classes.bannerTitle} ${
          props.classes[`bannerTitle-${props.screenSize}`]
        }`}
      >
        <strong>Advocate</strong> for fairness, equality, and justice
      </Typography>
      <Typography
        className={`${props.classes.bannerSubTitle} ${
          props.classes[`bannerSubTitle-${props.screenSize}`]
        }`}
      >
        {SUBTEXT}
      </Typography>
      <section className={props.classes.bannerLinkSection}>
        <a className={props.classes.bannerLink} href={BUTTON_URL}>
          {BUTTON_TEXT}
        </a>
      </section>
    </section>
  );
};

export default withStyles(publicInfoStyles)(PublicInfoBanner);
