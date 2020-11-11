import { Container, Grid, Typography, Link } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styles from "./dashboardStyling/styles";
import React from "react";
import logoSmall from "./assets/logo_sm.svg";
import useTheme from "@material-ui/core/styles/useTheme";

const DashboardNavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Grid container style={{ padding: theme.dashboard.navBar.padding }}>
      <Grid item xs={8} style={{ marginBottom: "22px" }}>
        <img
          src={isMobile ? logoSmall : "/favicon.ico"}
          style={{
            width: theme.dashboard.navBar.logoWidth,
            height: theme.dashboard.navBar.logoHeight
          }}
        />
      </Grid>
      <Grid item xs={4} style={{ padding: 0 }}>
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
              href="/data/about"
              underline="none"
              style={{ color: styles.navBarLink.color }}
              data-testid="aboutLink"
            >
              About
            </Link>
          </Typography>
      <Typography style={styles.navBarLink} style={{ paddingLeft: "32px" }}>
            <Link
              href="/data/glossary"
              underline="none"
              style={{ color: styles.navBarLink.color }}
              data-testid="glossaryLink"
            >
              Glossary
            </Link>
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
};

export default DashboardNavBar;
