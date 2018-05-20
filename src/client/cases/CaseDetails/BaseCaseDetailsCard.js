import React from "react";
import { Card, CardContent, Divider, Typography } from "material-ui";
import { withStyles } from "material-ui";

const styles = {
  subtitle: {
    paddingTop: "0px"
  }
};

const BaseCaseDetailsCard = ({ title, subtitle, classes, children }) => (
  <Card
    style={{
      backgroundColor: "white",
      marginLeft: "5%",
      marginRight: "5%",
      maxWidth: "850px",
      marginBottom: "24px"
    }}
  >
    <CardContent>
      <Typography variant="title">{title}</Typography>
    </CardContent>
    {subtitle ? (
      <CardContent className={classes.subtitle}>{subtitle}</CardContent>
    ) : null}
    <Divider />
    {children}
  </Card>
);

export default withStyles(styles)(BaseCaseDetailsCard);
