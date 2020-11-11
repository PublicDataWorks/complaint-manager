import React from "react";
import { Button, Grid, Icon, Link, Typography } from "@material-ui/core";
import styles from "./dashboardStyling/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import dashboardStylingMobile from "./dashboardStyling/dashboardStylingMobile";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";

const tagGlossary = require("./assets/tag-glossary.json");

const transformTagDescription = (tagName, tagDescription) => {
  const [firstFragment, ...otherFragments] = tagDescription
    .split(tagName)
    .filter(Boolean);

  const trimmedFragment = firstFragment.trimStart();
  const capitalLetter = trimmedFragment[0].toUpperCase();
  const restOfFragment = trimmedFragment.substring(1);

  return [`${capitalLetter}${restOfFragment}`, ...otherFragments].join(tagName);
};

const generateTagBlocks = () => {
  return Object.entries(tagGlossary).map(([tagName, tagDescription], index) => {
    return (
      <div key={index}>
        <Grid item xs={7} style={{ paddingBottom: "18px" }}>
          <Typography variant="body2" style={{ color: styles.colors.white }}>
            {tagName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} style={{ paddingBottom: "64px" }}>
          <Typography variant="body1" style={{ color: styles.colors.white }}>
            {transformTagDescription(tagName, tagDescription)}
          </Typography>
        </Grid>
      </div>
    );
  });
};

const DashboardGlossaryWrapper = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <MuiThemeProvider
      theme={isMobile ? dashboardStylingMobile : dashboardStylingDesktop}
    >
      <MuiThemeProvider theme={dashboardStyling}>
        <DashboardGlossary />
      </MuiThemeProvider>
    </MuiThemeProvider>
  );
};

const DashboardGlossary = () => {
  const theme = useTheme();

  return (
    <div>
      <Grid
        container
        spacing={3}
        style={{
          padding: theme.dashboard.glossary.padding,
          backgroundColor: styles.colors.oipmBlue
        }}
      >
        <Grid
          item
          xs={7}
          style={{
            paddingLeft: "0",
            paddingTop: "32px",
            paddingBottom: "120px"
          }}
        >
          <Button
            variant="contained"
            href="/data"
            style={{
              textTransform: "none",
              padding: "16px 24px",
              borderRadius: 3,
              boxShadow: "none",
              backgroundColor: styles.colors.buttonGray,
              marginBottom: "4px"
            }}
          >
            <Icon
              style={{
                color: styles.colors.iconGray,
                marginRight: "16px"
              }}
            >
              arrow_back
            </Icon>
            <Typography
              variant="body2"
              style={{ color: styles.colors.textGray }}
            >
              Return to front page
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={7} style={{ padding: "0" }}>
          <Typography
            variant="h2"
            style={{ padding: "116px 0", color: styles.colors.white }}
          >
            Tag Glossary
          </Typography>
        </Grid>
        {generateTagBlocks()}
      </Grid>
      <Typography style={{ padding: "24px 56px 56px 56px" }}>&nbsp;</Typography>
    </div>
  );
};

export default DashboardGlossaryWrapper;
