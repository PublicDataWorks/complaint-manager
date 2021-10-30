import { Container, Grid, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styles from "./dashboardStyling/styles";
import React from "react";
import logoSmall from "./assets/logo_sm.svg";
import useTheme from "@material-ui/core/styles/useTheme";
import { Link } from "react-router-dom";

const DashboardNavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Grid container style={{ padding: theme.dashboard.navBar.padding }}>
      <Grid item xs={5} style={{ marginBottom: "22px" }}>
        <img
          src={isMobile ? logoSmall : "/favicon.ico"}
          style={{
            width: theme.dashboard.navBar.logoWidth,
            height: theme.dashboard.navBar.logoHeight
          }}
        />
      </Grid>
      <Grid item xs={7} style={{ padding: 0 }}>
        <Container
          style={{
            display: "flex",
            padding: theme.dashboard.navBar.menuPadding,
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Typography style={styles.navBarLink}>
            <Link
              to="/data/about"
              style={{
                color: styles.navBarLink.color,
                textDecoration: styles.navBarLink.textDecoration
              }}
              data-testid="aboutLink"
            >
              About
            </Link>
          </Typography>
          <Typography style={styles.navBarLink} style={{ paddingLeft: "32px" }}>
            <Link
              to="/data/glossary"
              underline="none"
              style={{
                color: styles.navBarLink.color,
                textDecoration: styles.navBarLink.textDecoration
              }}
              data-testid="glossaryLink"
            >
              Tag Glossary
            </Link>
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
};

export default DashboardNavBar;
