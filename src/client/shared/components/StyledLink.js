import React from "react";
import { withStyles } from "@material-ui/core/styles";
import themeStyles from "../../globalStyling/styles";
import { Link } from "react-router-dom";

const styles = () => ({
  root: themeStyles.link
});

function StyledLink(props) {
  const { children, classes, ...other } = props;
  if (props.to) {
    return (
      <Link className={classes.root} {...other}>
        {children}
      </Link>
    );
  } else {
    return (
      <a className={classes.root} {...other}>
        {children}
      </a>
    );
  }
}
export default withStyles(styles)(StyledLink);
