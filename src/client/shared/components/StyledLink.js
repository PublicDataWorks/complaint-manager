import React from "react";
import { withStyles } from "material-ui/styles";
import themeStyles from "../../globalStyling/styles";
import { Link } from "react-router-dom";

const styles = () => ({
  root: themeStyles.link
});

function StyledLink(props) {
  const { children, classes, ...other } = props;

  return (
    <Link className={classes.root} {...other}>
      {children}
    </Link>
  );
}
export default withStyles(styles)(StyledLink);
