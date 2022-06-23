import React from "react";
import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  subtitle: {
    paddingTop: "0px"
  }
};

const DetailsCard = ({ title, subtitle, classes, children }) => (
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
      <Typography variant="h6">{title}</Typography>
    </CardContent>
    {subtitle ? (
      <CardContent className={classes.subtitle}>{subtitle}</CardContent>
    ) : null}
    <Divider />
    {children}
  </Card>
);

export default withStyles(styles)(DetailsCard);
