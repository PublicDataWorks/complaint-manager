import { Container, Grid, Typography, Link } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styles from "./dashboardStyling/styles";
import React from "react";
import logoSmall from "./assets/logo_sm.svg";

const DashboardNavBar = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <Grid container>
      <Grid item xs={8} style={{ marginBottom: "22px" }}>
        <img
          src={isMobile ? logoSmall : "/favicon.ico"}
          style={{
            width: isMobile ? "54px" : "132px",
            height: isMobile ? "66px" : "120px"
          }}
        />
      </Grid>
      <Grid item xs={4} style={{ padding: 0 }}>
        <Container
          style={{
            display: "flex",
            padding: isMobile ? "24px 0px" : "48px 0px",
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
};

export default DashboardNavBar;
