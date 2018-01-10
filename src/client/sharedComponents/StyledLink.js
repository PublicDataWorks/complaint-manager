import React from 'react';
import {withStyles} from "material-ui/styles";
import themeStyles from '../globalStyling/styles'

const styles = () => ({
  root: themeStyles.link
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
export default withStyles(styles)(StyledLink)