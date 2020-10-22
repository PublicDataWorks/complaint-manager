import { Container, Grid, Typography } from "@material-ui/core";
import styles from "./dashboardStyling/styles";
import React, { Component } from "react";

class DashboardNavBar extends Component {
  render() {
    return (
      <Grid container>
        <Grid item xs={8} style={{ marginBottom: "22px" }}>
          <img src="/favicon.ico" style={{ width: "132px", height: "120px" }} />
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
      </Grid>
    );
  }
}

export default DashboardNavBar;
