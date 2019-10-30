import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import themeStyles from "../../../common/globalStyling/styles";

const styles = () => ({
  button: themeStyles.link
});

const LinkButton = ({ classes: { button }, children, className, ...other }) => (
  <Button className={button} {...other}>
    {children}
  </Button>
);

export default withStyles(styles)(LinkButton);
