import React, { Component } from "react";
import { Typography, Grid, Button, Icon, Container } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import styles from "./dashboardStyling/styles";

const handleClick = event => {
  const anchor = (event.target.ownerDocument || document).querySelector(
    "#complaints-over-time"
  );

  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

class PublicDataDashboard extends Component {
  render() {
    return (
      <MuiThemeProvider theme={dashboardStyling}>
        <Grid
          container
          spacing={3}
          style={{ padding: "64px", backgroundColor: "white" }}
        >
          <Grid item xs={8} style={{ marginBottom: "22px" }}>
            <img
              src="/favicon.ico"
              style={{ width: "132px", height: "120px" }}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 0 }}>
            <Container
              style={{
                display: "flex",
                padding: "48px 0px",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Typography style={styles.navBarLink}>About</Typography>
              <Typography
                style={{
                  paddingLeft: "32px",
                  color: styles.navBarLink.color,
                  fontSize: styles.navBarLink.fontSize,
                  fontWeight: styles.navBarLink.fontWeight
                }}
              >
                Glossary
              </Typography>
            </Container>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h3">
              The{" "}
              <a href={"#"} style={styles.link}>
                Office of the Independent Police Monitor
              </a>{" "}
              (OIPM) is sharing data with the public to increase transparency to
              inform and empower the community the office was designed to serve.
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              The Office of the Independent Police Monitor receives
              commendations and complaints, monitors and reviews misconduct
              complaint investigations and disciplinary proceedings, and keeps
              data on relevant trends and patterns to communicate back to the
              NOPD through policy and practice recommendations.
            </Typography>
            <br />
            <Typography variant="body2">
              This dashboard showcases data visualizations regarding the
              complaint process and complaints the Office of the Independent
              Police Monitor received directly.
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
                onClick={handleClick}
                style={{
                  textTransform: "none",
                  padding: "16px 48px",
                  borderRadius: 0,
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
                  color: styles.colors.iconGray
                }}
                onClick={handleClick}
              >
                double_arrow
              </Icon>
            </Container>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ backgroundColor: styles.colors.oipmBlue, padding: 0 }}
          >
            <Container style={{ padding: "110px 64px 128px" }}>
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
              <Container
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
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                  id="complaints-over-time"
                >
                  Who is submitting complaints over time?
                </Typography>
              </Container>
              <Container
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
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  How do complainants submit complaints?
                </Typography>
              </Container>
              <Container
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
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  Who submits complaints?
                </Typography>
              </Container>
              <Container
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
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
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
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default PublicDataDashboard;
