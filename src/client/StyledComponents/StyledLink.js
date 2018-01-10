import React from 'react';
import {withStyles} from "material-ui/styles";

const styles = theme => ({
  root: {
    color: theme.palette.blue,
    fontSize: "0.875rem",
    fontWeight: 500,
    textDecoration: 'none'
  }
});

function StyledLink(props) {
  const { children, classes, ...other } = props;

  return (
    <a
      className={classes.root}
      {...other}
    >
      {children}
    </a>
  );
}
export default withStyles(styles, {withTheme: true})(StyledLink)