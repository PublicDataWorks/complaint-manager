import React, { useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  Icon,
  Container,
  Link
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import dashboardStylingMobile from "./dashboardStyling/dashboardStylingMobile";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";
import styles from "./dashboardStyling/styles";
import {
  DATA_SECTIONS,
  DDS_LOCATION_DATA
} from "../../sharedUtilities/constants";
import DashboardNavBar from "./DashboardNavBar";
import DashboardDataSection from "./DashboardDataSection";
import moment from "moment";
import { formatShortDate } from "../../sharedUtilities/formatDate";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";
import { connect } from "react-redux";

const {
  PD,
  CITY,
  ORGANIZATION
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const removeDragCover = () => {
  const callback = mutationsList => {
    mutationsList.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        const isDragCover =
          node.classList && node.classList.contains("dragcover");
        if (isDragCover) node.remove();
      });
    });
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, { childList: true });

  document.addEventListener("onbeforeunload", () => {
    observer.disconnect();
  });
};

const scrollIntoViewById = selector => event => {
  const target = event.target.ownerDocument || document;
  const anchorElement = target.querySelector(selector);
  if (!anchorElement) return;

  anchorElement.scrollIntoView({
    behavior: "smooth"
  });
};

const PublicDataDashboardWrapper = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <MuiThemeProvider
      theme={isMobile ? dashboardStylingMobile : dashboardStylingDesktop}
    >
      <MuiThemeProvider theme={dashboardStyling}>
        <PublicDataDashboardContainer />
      </MuiThemeProvider>
    </MuiThemeProvider>
  );
};

const PublicDataDashboard = ({ publicMapVisualizationFeature }) => {
  useEffect(removeDragCover);

  const theme = useTheme();
  const currentDate = formatShortDate(moment(Date.now()));

  return (
    <main>
      <Grid
        container
        spacing={3}
        style={{
          padding: theme.dashboard.padding,
          backgroundColor: "white"
        }}
      >
        <DashboardNavBar />
        <Grid item xs={12} sm={8}>
          <Typography variant="h3" data-testid="introText">
            The{" "}
            <Link href="https://nolaipm.gov/" style={styles.link}>
              Office of the Independent Police Monitor
            </Link>{" "}
            ({ORGANIZATION}) is sharing data with the public to increase
            transparency to inform and empower the {CITY} community.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="body1">
            The Office of the Independent Police Monitor receives commendations
            and complaints, monitors and reviews misconduct complaint
            investigations and disciplinary proceedings, and keeps data on
            relevant trends and patterns to communicate back to the {PD} through
            policy and practice recommendations.
          </Typography>
          <br />
          <Typography variant="body2">
            This dashboard showcases data visualizations regarding the complaint
            process and complaints the Office of the Independent Police Monitor
            received directly.
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: "116px" }}>
          <Container
            style={{
              padding: 0,
              margin: 0,
              flexDirection: "column",
              alignItems: "center",
              display: "flex",
              maxWidth: "220px"
            }}
          >
            <Button
              variant="contained"
              onClick={scrollIntoViewById("#blue-box")}
              style={{
                textTransform: "none",
                padding: "16px 44px",
                borderRadius: 3,
                boxShadow: "none",
                backgroundColor: styles.colors.buttonGray,
                marginBottom: "4px"
              }}
            >
              <Typography variant="body1">Explore the data</Typography>
            </Button>
            <Icon
              style={{
                transform: "rotate(90deg)",
                color: styles.colors.blue
              }}
              onClick={scrollIntoViewById("#blue-box")}
            >
              double_arrow
            </Icon>
          </Container>
        </Grid>

        <a id="blue-box" style={{ margin: "9px 0" }}>
          &nbsp;
        </a>

        <Grid
          item
          xs={12}
          style={{
            backgroundColor: styles.colors.blue,
            padding: 0,
            marginBottom: "98px"
          }}
        >
          <Container style={{ padding: theme.dashboard.box.padding }}>
            <Typography
              variant="h2"
              style={{
                color: styles.colors.white,
                paddingLeft: "6px",
                paddingBottom: "32px"
              }}
            >
              What are we looking for?
            </Typography>
            {publicMapVisualizationFeature ? (
              <Container
                onClick={scrollIntoViewById("#location-data")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.8"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  Where are complaints being filed?
                </Typography>
              </Container>
            ) : (
              ""
            )}
            <Container
              onClick={scrollIntoViewById("#complaints-over-time")}
              style={{
                display: "flex",
                padding: "24px 0px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <Icon
                style={{
                  transform: "rotate(90deg)",
                  color: styles.colors.white,
                  opacity: "0.8"
                }}
              >
                double_arrow
              </Icon>
              <Typography
                variant="body1"
                style={{
                  cursor: "pointer",
                  letterSpacing: "1px",
                  color: styles.colors.white,
                  paddingLeft: "12px",
                  opacity: 0.9
                }}
              >
                Who is submitting complaints over time?
              </Typography>
            </Container>
            <Container
              onClick={scrollIntoViewById("#complainants-submit-complaints")}
              style={{
                display: "flex",
                padding: "24px 0px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <Icon
                style={{
                  transform: "rotate(90deg)",
                  color: styles.colors.white,
                  opacity: "0.8"
                }}
              >
                double_arrow
              </Icon>
              <Typography
                variant="body1"
                style={{
                  cursor: "pointer",
                  letterSpacing: "1px",
                  color: styles.colors.white,
                  paddingLeft: "12px",
                  opacity: 0.9
                }}
              >
                How do complainants submit complaints?
              </Typography>
            </Container>
            <Container
              onClick={scrollIntoViewById("#who-submits-complaints")}
              style={{
                display: "flex",
                padding: "24px 0px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <Icon
                style={{
                  transform: "rotate(90deg)",
                  color: styles.colors.white,
                  opacity: "0.8"
                }}
              >
                double_arrow
              </Icon>
              <Typography
                variant="body1"
                style={{
                  cursor: "pointer",
                  letterSpacing: "1px",
                  color: styles.colors.white,
                  paddingLeft: "12px",
                  opacity: 0.9
                }}
              >
                Who submits complaints?
              </Typography>
            </Container>
            <Container
              onClick={scrollIntoViewById("#emerging-themes")}
              style={{
                display: "flex",
                padding: "24px 0px",
                alignItems: "center"
              }}
            >
              <Icon
                style={{
                  transform: "rotate(90deg)",
                  color: styles.colors.white,
                  opacity: "0.8"
                }}
              >
                double_arrow
              </Icon>
              <Typography
                variant="body1"
                style={{
                  cursor: "pointer",
                  letterSpacing: "1px",
                  color: styles.colors.white,
                  paddingLeft: "12px",
                  opacity: 0.9
                }}
              >
                What themes are emerging from the data?
              </Typography>
            </Container>
          </Container>
        </Grid>

        {Object.keys(DATA_SECTIONS)
          .filter(
            key => publicMapVisualizationFeature || key !== DDS_LOCATION_DATA
          )
          .map((dataSectionType, index) => {
            return (
              <DashboardDataSection
                key={index}
                dataSectionType={dataSectionType}
              />
            );
          })}

        <Grid
          item
          xs={12}
          style={{
            backgroundColor: styles.colors.softBlack,
            padding: 0,
            marginBottom: "98px"
          }}
        >
          <Container style={{ padding: theme.dashboard.box.padding }}>
            <Typography
              variant="h2"
              style={{
                color: styles.colors.white,
                paddingLeft: "6px",
                paddingBottom: "36px",
                maxWidth: theme.dashboard.box.titleMaxWidth
              }}
            >
              Have you had an encounter with police in {CITY}?
            </Typography>
            <Button
              variant="contained"
              href="https://nolaipm.gov/file-a-complaint/"
              style={{
                textTransform: "none",
                padding: "16px 24px",
                borderRadius: 0,
                boxShadow: "none",
                backgroundColor: styles.colors.buttonGray,
                marginBottom: "4px"
              }}
            >
              <Typography variant="body2">
                File a complaint or compliment
              </Typography>
            </Button>
          </Container>
        </Grid>
      </Grid>
      <Typography
        style={{
          color: styles.colors.textGray,
          padding: "24px 56px 56px 56px"
        }}
      >
        {`Last updated ${currentDate}`}
      </Typography>
    </main>
  );
};

const PublicDataDashboardContainer = connect(state => ({
  publicMapVisualizationFeature:
    state.featureToggles.publicMapVisualizationFeature
}))(PublicDataDashboard);

export default PublicDataDashboardWrapper;
