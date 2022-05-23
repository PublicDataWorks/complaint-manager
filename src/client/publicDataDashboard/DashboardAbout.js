import React from "react";
import { Grid, Icon, Link as MUILink, Typography } from "@material-ui/core";
import styles from "./dashboardStyling/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import dashboardStylingMobile from "./dashboardStyling/dashboardStylingMobile";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";
import LinkButton from "../policeDataManager/shared/components/LinkButton";
import { Link } from "react-router-dom";
import oipmBuilding from "./assets/oipm_building.jpeg";
import { connect } from "react-redux";
import { CONFIGS } from "../../sharedUtilities/constants";

const DashboardAboutWrapper = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  let MainComponent = connect(state => ({
    configs: state.configs
  }))(DashboardAbout);

  return (
    <MuiThemeProvider
      theme={isMobile ? dashboardStylingMobile : dashboardStylingDesktop}
    >
      <MuiThemeProvider theme={dashboardStyling}>
        <MainComponent />
      </MuiThemeProvider>
    </MuiThemeProvider>
  );
};

const DashboardAbout = ({ configs }) => {
  const theme = useTheme();

  return (
    <div>
      <Grid
        container
        spacing={3}
        style={{
          padding: theme.dashboard.about.padding,
          backgroundColor: "white"
        }}
      >
        <Grid
          item
          xs={12}
          style={{ paddingTop: "32px", paddingBottom: "120px" }}
        >
          <LinkButton
            variant="contained"
            to="/data"
            component={Link}
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
          </LinkButton>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: "22px" }}>
          <Typography variant="h2">About the Dashboard</Typography>
        </Grid>
        <Grid item xs={12} sm={7} style={{ paddingBottom: "96px" }}>
          <img
            src={oipmBuilding}
            style={{
              width: "100%",
              height: "100%"
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">Complaints</Typography>
        </Grid>
        <Grid item xs={12} sm={7} style={{ paddingBottom: "96px" }}>
          <Typography variant="body1">
            In 2019, the {configs[CONFIGS.ORGANIZATION_TITLE]} received one
            hundred (100) complaints. <br />
            <br /> These complaints ranged from how the police interacted with
            them and their loved ones during calls for assistance to how the
            police treated one another internally. <br />
            <br /> The {configs[CONFIGS.ORGANIZATION_TITLE]} received named and
            anonymous complaints from officers and civilians working within the{" "}
            {configs[CONFIGS.CITY]} Police Department. <br />
            <br /> Some of the complaints were from officers who were speaking
            up regarding disparities in disciplinary concerns and some anonymous
            complaints brought the {configs[CONFIGS.ORGANIZATION]}’s attention
            to possible relationships between supervisors and subordinates and
            misuse of Department equipment. <br />
            <br /> Each complaint was an opportunity for the{" "}
            {configs[CONFIGS.ORGANIZATION_TITLE]} to make these individuals feel
            heard and to work alongside the {configs[CONFIGS.PD]} to ensure
            there was accountability.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">Data</Typography>
        </Grid>
        <Grid item xs={12} sm={7} style={{ paddingBottom: "96px" }}>
          <Typography variant="body1">
            The {configs[CONFIGS.ORGANIZATION_TITLE]} is sharing this data with
            the community and public with the hope of increasing transparency to
            inform and empower the community the{" "}
            {configs[CONFIGS.ORGANIZATION_TITLE]} was designed to serve. The
            public, our partners, and stakeholders can reference these charts
            and data in their work and further share this information. <br />
            <br /> Complaints of officer misconduct and accounts of exemplary
            policing from both the community and those within the police
            district are valuable and can be the catalyst for important progress
            within the police department. Each complaint and commendation is an
            opportunity for the {configs[CONFIGS.CITY]} Police Department (
            {configs[CONFIGS.PD]}) to learn more about themselves and to adapt
            to the changing needs of the community, and when properly handled
            brings the {configs[CONFIGS.PD]} one step closer to being in full
            compliance with the Federal Consent Decree. <br />
            <br /> This dashboard contains data visualizations regarding our
            complaint process and the complaints the{" "}
            {configs[CONFIGS.ORGANIZATION_TITLE]}
            received. The charts and graphs capture different aspects of our
            internal process regarding complaint intake or information about the
            complaints or the complainant themselves. The data only captures the
            accounts of officer misconduct submitted directly to the{" "}
            {configs[CONFIGS.ORGANIZATION_TITLE]}. This data is taken directly
            from our internally designed database: Police Data Manager. <br />
            <br /> As information is entered into Police Data Manager by our
            staff and complaint referrals are submitted to the{" "}
            {configs[CONFIGS.BUREAU]}, the data will automatically update once
            daily.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">What's next?</Typography>
        </Grid>
        <Grid item xs={12} sm={7} style={{ paddingBottom: "64px" }}>
          <Typography variant="body1">
            At this time, these tables do not include any data visualizations
            regarding the complaints submitted directly to the{" "}
            {configs[CONFIGS.PD]}’s Public Integrity Bureau. <br />
            <br /> In the future, the {configs[CONFIGS.ORGANIZATION]} seeks to
            expand our data visualizations to include: data regarding requests
            for commendations to recognize positive policing, data from
            complaints received by our remote intake sites, data regarding the
            outcome of the investigations or disciplinary actions taken in
            response to these complaints, and data regarding complaints
            submitted to directly to the {configs[CONFIGS.BUREAU]}. <br />
            <br /> For more data visualizations regarding some of these topics
            and Use of Force and Critical Incidents, please see the annual
            report section of the {configs[CONFIGS.ORGANIZATION]} website (link
            out to annual report{" "}
            <MUILink href="https://nolaipm.gov/annual-reports/">here</MUILink>).
          </Typography>
        </Grid>
      </Grid>
      <Typography style={{ padding: "24px 56px 56px 56px" }}>&nbsp;</Typography>
    </div>
  );
};

export default DashboardAboutWrapper;
