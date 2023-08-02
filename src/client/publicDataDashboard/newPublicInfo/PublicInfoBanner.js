import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import { Typography } from "@material-ui/core";

export const SUBTEXT =
  "A new report finds overcrowded prisons, inhumane facilities conditions, and low staffing is unprecedented. Learn how these issues are address to the community, legislators, and the Department of Public Safety to ensure safer conditions.";
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
        variant="h2"
        className={`${props.classes.bannerTitle} ${
          props.classes[`bannerTitle-${props.screenSize}`]
        }`}
      >
        Empowering Rehabilitation,
      </Typography>
      <Typography
        variant="h2"
        className={`${props.classes.bannerTitle} ${
          props.classes[`bannerTitle-${props.screenSize}`]
        }`}
      >
        Inspiring Change
      </Typography>
      <Typography
        className={`${props.classes.bannerSubTitle} ${
          props.classes[`bannerSubTitle-${props.screenSize}`]
        }`}
      >
        {SUBTEXT}
      </Typography>
      <section className={props.classes.bannerLinkSection}>
        <a
          className={props.classes.bannerLink}
          href={BUTTON_URL}
          target="_blank"
        >
          {BUTTON_TEXT}
        </a>
      </section>
    </section>
  );
};

export default withStyles(publicInfoStyles)(PublicInfoBanner);
