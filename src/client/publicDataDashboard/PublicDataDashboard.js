import React, { Component } from "react";
import { Typography, Grid, Button, Icon } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import styles from "./dashboardStyling/styles";

class PublicDataDashboard extends Component {
  render() {
    return (
      <MuiThemeProvider theme={dashboardStyling}>
        <Grid
          container
          spacing={3}
          style={{ padding: "64px", backgroundColor: "white" }}
        >
          <Grid item xs={12} style={{ marginBottom: "22px" }}>
            <img
              src="/favicon.ico"
              style={{ width: "132px", height: "120px" }}
            />
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
          <Grid item xs={12}>
            <div
              style={{
                flexDirection: "column",
                alignItems: "center",
                display: "flex",
                maxWidth: "220px"
              }}
            >
              <Button
                variant="contained"
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
              >
                double_arrow
              </Icon>
            </div>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default PublicDataDashboard;
